"""Eligibility engine: pre-filters schemes before sending to AI,
and merges AI results with full scheme data for the API response."""
from __future__ import annotations

import json
import logging
import os
from typing import Optional

from sqlalchemy.orm import Session

from app import crud, schemas
from app.services import groq_service

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Situation → category mapping (loaded from situations.json)
# ---------------------------------------------------------------------------

_situations_map: dict[str, list[str]] = {}


def _load_situations_map() -> dict[str, list[str]]:
    global _situations_map
    if _situations_map:
        return _situations_map

    path = os.path.join(os.path.dirname(__file__), "..", "data", "situations.json")
    with open(os.path.normpath(path), "r", encoding="utf-8") as f:
        data = json.load(f)

    mapping: dict[str, list[str]] = {}
    for item in data.get("situations", []):
        # Map slug → categories
        mapping[item["slug"]] = item["mapped_categories"]
        # Also map each keyword → categories for fuzzy matching
        for kw in item.get("keywords", []):
            mapping[kw] = item["mapped_categories"]

    _situations_map = mapping
    return _situations_map


# ---------------------------------------------------------------------------
# Pre-filter helpers
# ---------------------------------------------------------------------------

def _occupation_matches(scheme_occupations: list[str], user_occupation: str) -> bool:
    """Return True if the scheme has no occupation restriction or the user fits."""
    if not scheme_occupations:
        return True
    user_occ_lower = user_occupation.lower()
    return any(occ.lower() in user_occ_lower or user_occ_lower in occ.lower()
               for occ in scheme_occupations)


def _income_matches(income_limit: Optional[int], user_income: int) -> bool:
    if income_limit is None:
        return True
    return user_income <= income_limit


def _age_matches(
    min_age: Optional[int], max_age: Optional[int], user_age: int
) -> bool:
    if min_age is not None and user_age < min_age:
        return False
    if max_age is not None and user_age > max_age:
        return False
    return True


def _situation_matches(
    scheme_situations: list[str], situation: Optional[str]
) -> bool:
    """Return True if the scheme is tagged with a situation similar to the user's."""
    if situation is None:
        return True
    sit_lower = situation.lower()
    return any(sit_lower in s.lower() or s.lower() in sit_lower
               for s in scheme_situations)


def _get_categories_for_situation(situation: Optional[str]) -> list[str]:
    if not situation:
        return []
    mapping = _load_situations_map()
    sit_lower = situation.lower()
    # Exact key match
    if sit_lower in mapping:
        return mapping[sit_lower]
    # Partial key match
    categories: list[str] = []
    for key, cats in mapping.items():
        if sit_lower in key or key in sit_lower:
            categories.extend(cats)
    return list(set(categories))


def pre_filter_schemes(
    schemes: list,
    user: schemas.UserProfileInput,
    situation: Optional[str],
) -> list[dict]:
    """
    Apply lightweight rule-based pre-filtering to reduce the scheme list
    before sending to the AI. Returns a list of plain dicts.
    """
    relevant_categories = _get_categories_for_situation(situation)
    results = []

    for scheme in schemes:
        eligibility = scheme.eligibility if hasattr(scheme, "eligibility") else scheme.get("eligibility", {})

        # Hard eligibility gates
        if not _income_matches(eligibility.get("income_limit"), user.income):
            continue
        if not _age_matches(eligibility.get("min_age"), eligibility.get("max_age"), user.age):
            continue

        # Occupation match
        occupation_ok = _occupation_matches(
            eligibility.get("occupation", []), user.occupation
        )
        category_ok = (
            not relevant_categories
            or (hasattr(scheme, "category") and scheme.category in relevant_categories)
            or (isinstance(scheme, dict) and scheme.get("category") in relevant_categories)
        )
        situation_tag_ok = _situation_matches(
            scheme.situations if hasattr(scheme, "situations") else scheme.get("situations", []),
            situation,
        )

        # When a situation is specified the scheme must match both occupation
        # AND be relevant to that situation (by category or situation tag).
        # When no situation is given, occupation alone is sufficient.
        situation_context_ok = category_ok or situation_tag_ok
        if situation:
            passes = occupation_ok and situation_context_ok
        else:
            passes = occupation_ok or category_ok or situation_tag_ok

        if passes:
            if hasattr(scheme, "__dict__"):
                s_dict = {
                    "scheme_id": scheme.id,
                    "scheme_name": scheme.scheme_name,
                    "category": scheme.category,
                    "description": scheme.description,
                    "eligibility": eligibility,
                    "benefits": scheme.benefits,
                    "required_documents": scheme.required_documents,
                    "situations": scheme.situations,
                    "application_deadline": scheme.application_deadline,
                    "official_link": scheme.official_link,
                    "application_centers": scheme.application_centers,
                }
            else:
                s_dict = dict(scheme)
            results.append(s_dict)

    logger.info(
        "Pre-filter: %d schemes after filtering (from total database)",
        len(results),
    )
    return results


# ---------------------------------------------------------------------------
# Main eligibility check entry point
# ---------------------------------------------------------------------------

def run_eligibility_check(
    db: Session,
    payload: schemas.EligibilityCheckInput,
) -> schemas.EligibilityResponse:
    """
    Full pipeline:
    1. Persist user profile
    2. Load all schemes, pre-filter
    3. Call Groq AI
    4. Merge AI results with full scheme data
    5. Persist result
    6. Return structured response
    """
    # 1. Save user profile
    db_profile = crud.create_user_profile(db, payload.user_profile)

    # 2. Load and pre-filter schemes
    all_schemes = crud.get_all_schemes(db, limit=500)
    filtered_schemes = pre_filter_schemes(all_schemes, payload.user_profile, payload.situation)

    if not filtered_schemes:
        # No schemes passed pre-filter; skip AI and return empty
        return schemas.EligibilityResponse(
            user_profile=payload.user_profile,
            situation=payload.situation,
            total_recommended=0,
            recommended_schemes=[],
            ai_summary="No schemes were found matching your profile. Please try updating your details or selecting a different situation.",
        )

    # 3. Call Groq AI
    ai_result = groq_service.get_eligibility_recommendations(
        age=payload.user_profile.age,
        income=payload.user_profile.income,
        occupation=payload.user_profile.occupation,
        location=payload.user_profile.location,
        situation=payload.situation,
        schemes=filtered_schemes,
    )

    # 4. Merge AI scheme picks with full scheme data
    scheme_lookup: dict[int, dict] = {s["scheme_id"]: s for s in filtered_schemes}
    recommended: list[schemas.RecommendedScheme] = []

    for ai_pick in ai_result.get("recommended_schemes", []):
        sid = ai_pick.get("scheme_id")
        full = scheme_lookup.get(sid)
        if full is None:
            # AI hallucinated an id — skip it
            logger.warning("AI returned unknown scheme_id %s, skipping.", sid)
            continue
        raw_benefits = full.get("benefits", [])
        if isinstance(raw_benefits, str):
            raw_benefits = [raw_benefits]

        recommended.append(
            schemas.RecommendedScheme(
                scheme_id=sid,
                scheme_name=full["scheme_name"],
                category=full["category"],
                benefits=raw_benefits,
                official_link=full.get("official_link"),
                required_documents=full.get("required_documents", []),
                application_centers=full.get("application_centers", []),
                reason=ai_pick.get("reason", "You appear to meet the eligibility criteria."),
            )
        )

    # 5. Persist result for audit
    crud.save_eligibility_result(
        db=db,
        user_profile_id=db_profile.id,
        situation=payload.situation,
        recommended_schemes=[r.model_dump() for r in recommended],
        raw_ai_response=ai_result.get("raw_response"),
    )

    # 6. Return response
    return schemas.EligibilityResponse(
        user_profile=payload.user_profile,
        situation=payload.situation,
        total_recommended=len(recommended),
        recommended_schemes=recommended,
        ai_summary=ai_result.get("ai_summary"),
    )

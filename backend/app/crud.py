"""CRUD helpers for database operations."""
from __future__ import annotations

import json
import os
from typing import Optional

from sqlalchemy.orm import Session

from app import models, schemas


# ---------------------------------------------------------------------------
# Scheme CRUD
# ---------------------------------------------------------------------------

def get_scheme(db: Session, scheme_id: int) -> Optional[models.Scheme]:
    return db.query(models.Scheme).filter(models.Scheme.id == scheme_id).first()


def get_all_schemes(
    db: Session, skip: int = 0, limit: int = 100
) -> list[models.Scheme]:
    return db.query(models.Scheme).offset(skip).limit(limit).all()


def get_schemes_by_category(db: Session, category: str) -> list[models.Scheme]:
    return (
        db.query(models.Scheme)
        .filter(models.Scheme.category.ilike(f"%{category}%"))
        .all()
    )


def create_scheme(db: Session, scheme: schemas.SchemeCreate) -> models.Scheme:
    db_scheme = models.Scheme(**scheme.model_dump())
    db.add(db_scheme)
    db.commit()
    db.refresh(db_scheme)
    return db_scheme


def seed_schemes_from_json(db: Session) -> int:
    """Seed the schemes table from the bundled JSON file if empty."""
    data_path = os.path.join(os.path.dirname(__file__), "data", "schemes.json")
    with open(data_path, "r", encoding="utf-8-sig") as f:
        raw_schemes = json.load(f)

    expected_count = len(raw_schemes)
    if db.query(models.Scheme).count() >= expected_count:
        return 0  # Already fully seeded

    # Clear stale data and re-seed
    db.query(models.Scheme).delete()
    db.commit()

    count = 0
    for raw in raw_schemes:
        eligibility_raw = dict(raw.get("eligibility", {}))
        eligibility_raw.setdefault("occupation", [])
        eligibility_raw.setdefault("income_limit", None)
        eligibility_raw.setdefault("min_age", None)
        eligibility_raw.setdefault("max_age", None)
        eligibility_raw.setdefault("states", eligibility_raw.pop("location", []))
        eligibility_raw.setdefault("special", [])

        # Normalise benefits: always store as list
        benefits_raw = raw.get("benefits", [])
        if isinstance(benefits_raw, str):
            benefits_raw = [benefits_raw]

        db_scheme = models.Scheme(
            scheme_name=raw["scheme_name"],
            category=raw["category"],
            description=raw["description"],
            eligibility=eligibility_raw,
            benefits=benefits_raw,
            required_documents=raw.get("required_documents", []),
            # Accept both field name variants
            situations=raw.get("situations_supported", raw.get("situations", [])),
            application_deadline=raw.get("application_deadline"),
            official_link=raw.get("apply_link", raw.get("official_link")),
            application_centers=raw.get("application_centers", []),
        )
        db.add(db_scheme)
        count += 1

    db.commit()
    return count


# ---------------------------------------------------------------------------
# UserProfile CRUD
# ---------------------------------------------------------------------------

def create_user_profile(
    db: Session, profile: schemas.UserProfileInput
) -> models.UserProfile:
    db_profile = models.UserProfile(**profile.model_dump())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


# ---------------------------------------------------------------------------
# EligibilityResult CRUD
# ---------------------------------------------------------------------------

def save_eligibility_result(
    db: Session,
    user_profile_id: Optional[int],
    situation: Optional[str],
    recommended_schemes: list[dict],
    raw_ai_response: Optional[str] = None,
) -> models.EligibilityResult:
    result = models.EligibilityResult(
        user_profile_id=user_profile_id,
        situation=situation,
        recommended_schemes=recommended_schemes,
        raw_ai_response=raw_ai_response,
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return result

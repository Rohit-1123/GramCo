"""Situation-based scheme discovery routes."""
from __future__ import annotations

import json
import os
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db
from app.services.eligibility_engine import _get_categories_for_situation

router = APIRouter(prefix="/situation-search", tags=["Situation Search"])


def _load_situations() -> list[dict]:
    path = os.path.join(
        os.path.dirname(__file__), "..", "data", "situations.json"
    )
    with open(os.path.normpath(path), "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("situations", [])


@router.get(
    "/all",
    response_model=schemas.SituationsListResponse,
    summary="List all available situations",
)
def list_all_situations():
    """
    Returns all pre-defined life situations that the platform supports.
    The frontend can display these as selectable options to the user.
    """
    situations = _load_situations()
    return schemas.SituationsListResponse(
        total=len(situations),
        situations=situations,
    )


@router.post(
    "",
    response_model=schemas.SchemeListResponse,
    summary="Search schemes by life situation",
)
def situation_search(
    payload: schemas.SituationSearchInput,
    db: Session = Depends(get_db),
):
    """
    Accepts a plain-language life situation (e.g., *"crop loss"*, *"medical emergency"*)
    and returns all schemes that are relevant to that situation.

    This does **not** require a user profile and does **not** invoke AI —
    it performs fast category-based filtering. Use `/api/check-eligibility`
    for personalised AI-powered recommendations.
    """
    categories = _get_categories_for_situation(payload.situation)
    all_schemes = crud.get_all_schemes(db, limit=500)

    if categories:
        filtered = [s for s in all_schemes if s.category in categories]
    else:
        # Fallback: keyword match against scheme situations tags
        sit_lower = payload.situation.lower()
        filtered = [
            s for s in all_schemes
            if any(sit_lower in tag.lower() or tag.lower() in sit_lower
                   for tag in (s.situations or []))
        ]

    return schemas.SchemeListResponse(total=len(filtered), schemes=filtered)

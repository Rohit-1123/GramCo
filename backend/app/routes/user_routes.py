"""User profile and eligibility check routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db
from app.services.eligibility_engine import run_eligibility_check

router = APIRouter(tags=["User & Eligibility"])


@router.post(
    "/user-profile",
    response_model=schemas.UserProfileResponse,
    summary="Submit user profile",
    status_code=201,
)
def submit_user_profile(
    payload: schemas.UserProfileInput,
    db: Session = Depends(get_db),
):
    """
    Accepts and persists a citizen's basic profile information.
    This profile is used later in eligibility checks.
    """
    db_profile = crud.create_user_profile(db, payload)
    return db_profile


@router.post(
    "/check-eligibility",
    response_model=schemas.EligibilityResponse,
    summary="AI-powered eligibility check",
)
def check_eligibility(
    payload: schemas.EligibilityCheckInput,
    db: Session = Depends(get_db),
):
    """
    The core AI endpoint.

    Accepts a user profile and optional real-life situation, pre-filters
    schemes based on hard eligibility rules, then invokes the Groq LLM to
    perform intelligent reasoning and generate personalised explanations.

    Returns a ranked list of recommended schemes with AI-generated reasons.
    """
    try:
        result = run_eligibility_check(db=db, payload=payload)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return result

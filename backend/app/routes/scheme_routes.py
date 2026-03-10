"""Scheme-related API routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/schemes", tags=["Schemes"])


@router.get("", response_model=schemas.SchemeListResponse, summary="Get all schemes")
def list_schemes(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=500, description="Max records to return"),
    db: Session = Depends(get_db),
):
    """Returns all available government schemes with pagination."""
    schemes = crud.get_all_schemes(db, skip=skip, limit=limit)
    total = len(crud.get_all_schemes(db, skip=0, limit=10000))
    return schemas.SchemeListResponse(total=total, schemes=schemes)


@router.get(
    "/{scheme_id}",
    response_model=schemas.SchemeResponse,
    summary="Get scheme by ID",
)
def get_scheme(scheme_id: int, db: Session = Depends(get_db)):
    """Returns detailed information for a single scheme by its ID."""
    scheme = crud.get_scheme(db, scheme_id)
    if scheme is None:
        raise HTTPException(status_code=404, detail=f"Scheme with id {scheme_id} not found.")
    return scheme

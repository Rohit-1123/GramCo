from __future__ import annotations

from typing import Any, Optional
from pydantic import BaseModel, Field, field_validator


# ---------------------------------------------------------------------------
# Scheme schemas
# ---------------------------------------------------------------------------

class SchemeEligibility(BaseModel):
    occupation: list[str] = Field(default_factory=list)
    income_limit: Optional[int] = None
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    states: list[str] = Field(default_factory=list)
    special: list[str] = Field(default_factory=list)


class SchemeBase(BaseModel):
    scheme_name: str
    category: str
    description: str
    eligibility: SchemeEligibility
    benefits: list[str]
    required_documents: list[str] = Field(default_factory=list)
    situations: list[str] = Field(default_factory=list)
    application_deadline: Optional[str] = None
    official_link: Optional[str] = None
    application_centers: list[str] = Field(default_factory=list)


class SchemeCreate(SchemeBase):
    pass


class SchemeResponse(SchemeBase):
    id: int

    model_config = {"from_attributes": True}


class SchemeListResponse(BaseModel):
    total: int
    schemes: list[SchemeResponse]


# ---------------------------------------------------------------------------
# User Profile schemas
# ---------------------------------------------------------------------------

class UserProfileInput(BaseModel):
    age: int = Field(..., ge=0, le=120, description="Age of the user in years")
    income: int = Field(..., ge=0, description="Annual income in INR")
    occupation: str = Field(..., min_length=1, max_length=100, description="User's occupation")
    location: str = Field(..., min_length=1, max_length=200, description="State or district of the user")

    @field_validator("occupation", "location", mode="before")
    @classmethod
    def strip_and_lower(cls, v: str) -> str:
        return v.strip().lower()

    model_config = {
        "json_schema_extra": {
            "example": {
                "age": 30,
                "income": 180000,
                "occupation": "farmer",
                "location": "Tamil Nadu",
            }
        }
    }


class UserProfileResponse(UserProfileInput):
    id: int
    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Situation schemas
# ---------------------------------------------------------------------------

class SituationSearchInput(BaseModel):
    situation: str = Field(
        ...,
        min_length=2,
        max_length=200,
        description="Real-life situation the user is facing",
    )

    @field_validator("situation", mode="before")
    @classmethod
    def strip_situation(cls, v: str) -> str:
        return v.strip().lower()

    model_config = {
        "json_schema_extra": {
            "example": {"situation": "crop loss"}
        }
    }


class SituationItem(BaseModel):
    id: int
    label: str
    slug: str
    keywords: list[str]
    mapped_categories: list[str]
    description: str


class SituationsListResponse(BaseModel):
    total: int
    situations: list[SituationItem]


# ---------------------------------------------------------------------------
# Eligibility / AI recommendation schemas
# ---------------------------------------------------------------------------

class EligibilityCheckInput(BaseModel):
    user_profile: UserProfileInput
    situation: Optional[str] = Field(
        None,
        description="Optional real-life situation to narrow scheme search",
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "user_profile": {
                    "age": 30,
                    "income": 180000,
                    "occupation": "farmer",
                    "location": "Tamil Nadu",
                },
                "situation": "crop loss",
            }
        }
    }


class RecommendedScheme(BaseModel):
    scheme_id: int
    scheme_name: str
    category: str
    benefits: list[str]
    official_link: Optional[str]
    required_documents: list[str]
    application_centers: list[str]
    reason: str  # AI-generated explanation


class EligibilityResponse(BaseModel):
    user_profile: UserProfileInput
    situation: Optional[str]
    total_recommended: int
    recommended_schemes: list[RecommendedScheme]
    ai_summary: Optional[str] = Field(
        None, description="Overall AI summary of recommendations"
    )

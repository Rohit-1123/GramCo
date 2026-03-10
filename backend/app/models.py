from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    JSON,
    DateTime,
    func,
)
from app.database import Base


class Scheme(Base):
    """Stores government welfare schemes."""

    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    scheme_name = Column(String(255), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)

    # JSON fields for flexible nested data
    eligibility = Column(JSON, nullable=False, default=dict)
    benefits = Column(JSON, nullable=False, default=list)
    required_documents = Column(JSON, nullable=False, default=list)
    situations = Column(JSON, nullable=False, default=list)

    application_deadline = Column(String(100), nullable=True)
    official_link = Column(String(500), nullable=True)
    application_centers = Column(JSON, nullable=False, default=list)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Scheme id={self.id} name={self.scheme_name!r}>"


class UserProfile(Base):
    """Stores (optionally) user profile snapshots for analytics."""

    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    age = Column(Integer, nullable=False)
    income = Column(Integer, nullable=False)
    occupation = Column(String(100), nullable=False)
    location = Column(String(200), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self) -> str:  # pragma: no cover
        return f"<UserProfile id={self.id} occupation={self.occupation!r}>"


class EligibilityResult(Base):
    """Persists AI eligibility check results for audit and caching."""

    __tablename__ = "eligibility_results"

    id = Column(Integer, primary_key=True, index=True)
    user_profile_id = Column(Integer, nullable=True)  # nullable: guest users
    situation = Column(String(200), nullable=True)
    recommended_schemes = Column(JSON, nullable=False, default=list)
    raw_ai_response = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self) -> str:  # pragma: no cover
        return f"<EligibilityResult id={self.id}>"

"""GramCo – Government Scheme Discovery Platform
FastAPI application entry point.
"""
from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine, SessionLocal
from app.crud import seed_schemes_from_json
from app.routes import scheme_routes, user_routes, situation_routes

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------
app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    description=(
        "AI-powered backend for discovering government welfare schemes. "
        "Citizens provide their profile and real-life situation; "
        "the system uses the Groq LLM to reason about eligibility and "
        "return personalised scheme recommendations with explanations."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Startup: create tables + seed data
# ---------------------------------------------------------------------------

@app.on_event("startup")
async def on_startup() -> None:
    logger.info("Creating database tables if they do not exist …")
    Base.metadata.create_all(bind=engine)

    logger.info("Seeding scheme data …")
    db = SessionLocal()
    try:
        seeded = seed_schemes_from_json(db)
        if seeded:
            logger.info("Seeded %d schemes into the database.", seeded)
        else:
            logger.info("Scheme data already present, skipping seed.")
    finally:
        db.close()

    logger.info("GramCo API ready.")


# ---------------------------------------------------------------------------
# Routers  (all mounted under /api)
# ---------------------------------------------------------------------------
API_PREFIX = "/api"

app.include_router(scheme_routes.router, prefix=API_PREFIX)
app.include_router(user_routes.router, prefix=API_PREFIX)
app.include_router(situation_routes.router, prefix=API_PREFIX)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/health", tags=["Health"], summary="Health check")
def health_check():
    """Simple health-check endpoint for load-balancers and monitoring."""
    return {"status": "ok", "version": settings.APP_VERSION}


@app.get("/", tags=["Root"], include_in_schema=False)
def root():
    return {
        "message": "Welcome to GramCo – Government Scheme Discovery API",
        "docs": "/docs",
        "health": "/health",
    }

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database (defaults to SQLite – zero setup required)
    DATABASE_URL: str = "sqlite:///./gramco.db"

    # Groq
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    # App
    APP_TITLE: str = "GramCo – Government Scheme Discovery API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()

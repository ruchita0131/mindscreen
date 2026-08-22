from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./mental_health.db"
    SECRET_KEY: str = "mindscreen-default-secret-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    REDIS_URL: Optional[str] = None  # Optional: in-memory fallback used if not set

    MODEL_PATH: str = "./ml/checkpoints/best_model.pt"
    TOKENIZER_NAME: str = "mental/mental-roberta-base"
    HF_TOKEN: Optional[str] = None

    ENVIRONMENT: str = "development"
    DEBUG: bool = False

    CRISIS_HELPLINE_1: str = "iCall: 9152987821"
    CRISIS_HELPLINE_2: str = "NIMHANS: 080-46110007"
    CRISIS_HELPLINE_3: str = "Vandrevala Foundation: 1860-2662-345"

    ALLOWED_ORIGINS: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

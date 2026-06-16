from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    REDIS_URL: str
    
    MODEL_PATH: str = "./ml/checkpoints/best_model.pt"
    TOKENIZER_NAME: str = "mental/mental-roberta-base"
    
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    CRISIS_HELPLINE_1: str
    CRISIS_HELPLINE_2: str
    CRISIS_HELPLINE_3: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

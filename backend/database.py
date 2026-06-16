from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

# Create engine — connection pool handles multiple requests
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=10,           # Max 10 simultaneous connections
    max_overflow=20,        # Allow 20 more during spikes
    pool_pre_ping=True,     # Test connection before using (prevents stale connections)
    echo=settings.DEBUG,    # Log SQL queries in development
)

# Session factory — create one session per request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class all models inherit from
Base = declarative_base()

# ── DEPENDENCY INJECTION ──────────────────────────────────────────────
# FastAPI calls this for every route that needs DB
def get_db():
    db = SessionLocal()
    try:
        yield db          # Give the session to the route handler
    finally:
        db.close()        # ALWAYS close — prevents connection leaks

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.mood_log import MoodLog
from models.user import User
from schemas.mood import MoodLogCreate, MoodLogResponse
from services.auth_service import get_current_user
from typing import List

router = APIRouter(prefix="/api/mood", tags=["mood"])

@router.post("/log", response_model=MoodLogResponse)
async def log_mood(
    request: MoodLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    mood_log = MoodLog(
        user_id=current_user.id,
        mood_score=request.mood_score,
        notes=request.notes
    )
    db.add(mood_log)
    db.commit()
    db.refresh(mood_log)
    return mood_log

@router.get("/trend", response_model=List[MoodLogResponse])
async def get_mood_trend(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logs = db.query(MoodLog).filter(MoodLog.user_id == current_user.id).order_by(MoodLog.date.asc()).all()
    return logs

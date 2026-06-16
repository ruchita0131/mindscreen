from pydantic import BaseModel
from typing import Optional
from datetime import date

class MoodLogCreate(BaseModel):
    mood_score: int
    notes: Optional[str] = None

class MoodLogResponse(BaseModel):
    id: int
    date: date
    mood_score: int
    notes: Optional[str] = None

    class Config:
        from_attributes = True

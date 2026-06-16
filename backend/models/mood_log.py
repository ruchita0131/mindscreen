from sqlalchemy import Column, Integer, ForeignKey, Date, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class MoodLog(Base):
    __tablename__ = "mood_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, default=datetime.date.today, nullable=False)
    mood_score = Column(Integer, nullable=False) # 1-5 scale
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="mood_logs")

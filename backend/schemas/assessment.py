from pydantic import BaseModel, conlist
from typing import List, Optional, Dict, Any

class PHQSubmitRequest(BaseModel):
    answers: conlist(int, min_length=9, max_length=9) # type: ignore

class PredictTextRequest(BaseModel):
    text: str

class FusedPredictRequest(BaseModel):
    answers: conlist(int, min_length=9, max_length=9) # type: ignore
    text: str
    audio_base64: Optional[str] = None

class RiskResponse(BaseModel):
    risk_level: str
    confidence: float
    probabilities: Dict[str, float]
    shap_explanation: Optional[Dict[str, Any]] = None
    crisis_flag: bool
    helplines: Optional[List[str]] = None

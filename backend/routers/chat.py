from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
import requests
import logging
from config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["Sukhoon AI Companion"])

class ChatMessage(BaseModel):
    sender: str = Field(..., description="'user' or 'sukhoon'")
    content: str = Field(..., description="Message text")

class ChatRequest(BaseModel):
    message: str = Field(..., description="User prompt or emotional unpacking message")
    history: Optional[List[ChatMessage]] = Field(default=[], description="Previous conversation trajectory")
    current_mood: Optional[str] = Field(default="neutral", description="Optional mood context")

class RecommendedActivity(BaseModel):
    title: str
    category: str
    duration: str
    action_type: str

class ChatResponse(BaseModel):
    reply: str
    companion_name: str = "Sukhoon (سکون / सुकून)"
    recommended_activity: Optional[RecommendedActivity] = None
    crisis_flag: bool = False
    helpline_info: Optional[str] = None

# Indian National Helplines for Crisis Prevention
TELE_MANAS_HELPLINE = "Tele-MANAS (Government of India): 14416 or 1800 891 4416 (24/7 Free Call)"
KIRAN_HELPLINE = "KIRAN Mental Health Helpline (Ministry of Social Justice): 1800-599-0019"

# System Prompt for Sukhoon AI Companion
SUKHOON_SYSTEM_PROMPT = """
You are Sukhoon (سکون / सुकून), a warm, empathetic, and culturally wise Indian AI mental wellness companion and therapist guide.
Your purpose is to help users unpack their daily emotions, manage stress (exam pressure, family dynamics, career anxiety, relationships), and find inner peace (sukhoon).

Guidelines:
1. Speak with deep warmth, empathy, and gentle validation ("I hear you", "That sounds really heavy to hold alone", "Take a deep breath with me").
2. Understand Indian cultural contexts gently (e.g. family expectations, academic pressures, societal guilt) without judging.
3. Keep responses conversational, concise (2-4 short paragraphs), and therapeutic (grounded in CBT and mindfulness).
4. Offer small, actionable grounding prompts (e.g., 4-7-8 Pranayama breathing, quiet reflection, writing thoughts down).
5. ALWAYS maintain safety: if the user expresses self-harm or severe crisis, express immediate care and provide Tele-MANAS (14416) helpline.
"""

def generate_heuristic_sukhoon_reply(message: str) -> dict:
    msg_lower = message.lower()
    
    # Crisis Detection
    crisis_keywords = ["kill myself", "suicide", "want to die", "end my life", "self harm", "no reason to live"]
    if any(k in msg_lower for k in crisis_keywords):
        return {
            "reply": "I hear how intensely heavy things feel right now, and I want you to know that your life is deeply valued. You do not have to carry this immense weight all by yourself. Please connect right away with a caring professional who can support you safely through this exact moment.",
            "crisis_flag": True,
            "helpline_info": f"{TELE_MANAS_HELPLINE} | {KIRAN_HELPLINE}",
            "recommended_activity": {
                "title": "Full-Screen 432Hz Sanctuary Breathwork",
                "category": "Immediate Crisis Grounding",
                "duration": "5 min",
                "action_type": "breathing"
            }
        }

    # Family & Relationships
    if any(k in msg_lower for k in ["mom", "dad", "parents", "family", "arguing", "fight", "misunderstand", "relatives"]):
        return {
            "reply": "Navigating family dynamics can be so deeply draining, especially when those closest to us struggle to see our perspective. It is completely natural to feel frustrated or hurt when expectations clash with your personal truth.\n\nTake a slow, deep breath. Remember that setting gentle emotional boundaries is an act of self-preservation, not disrespect. Would you like to unpack what triggered the argument today, or try a 3-minute calming breathwork session together?",
            "recommended_activity": {
                "title": "Communicating with Care & Inner Peace",
                "category": "Guided Reflection",
                "duration": "5 min",
                "action_type": "breathing"
            }
        }

    # Academic & Career Stress
    if any(k in msg_lower for k in ["exam", "marks", "grade", "study", "job", "work", "career", "future", "boss", "interview", "fail"]):
        return {
            "reply": "The pressure to perform and meet expectations can feel overwhelming, like a constant weight on your shoulders. Please remind yourself: your worth as a human being is never defined by a single exam, grade, or interview result.\n\nYou are working hard, and it is essential to give your mind a pause so you can recharge. Let's ground your energy right now with a short breathing exercise.",
            "recommended_activity": {
                "title": "Pranayama 4-7-8 Anxiety Release",
                "category": "Stress Relief",
                "duration": "4 min",
                "action_type": "breathing"
            }
        }

    # Sleep & Overthinking
    if any(k in msg_lower for k in ["sleep", "insomnia", "night", "overthinking", "thoughts", "can't sleep", "mind racing"]):
        return {
            "reply": "When night falls and the world slows down, our minds often turn up the volume on every unspoken thought and worry. It's exhausting when all you want is rest.\n\nLet go of the need to solve everything tonight. Soften your shoulders, unclench your jaw, and let your body sink into comfort. Let's do a quiet relaxation session together.",
            "recommended_activity": {
                "title": "Sukhoon Nighttime Ambient Relaxation",
                "category": "Sleep & Calming",
                "duration": "8 min",
                "action_type": "breathing"
            }
        }

    # Default Empathetic Response
    return {
        "reply": "Thank you for sharing your heart with me today. Unpacking what we hold inside takes courage. Whatever you are feeling right now—whether it's exhaustion, anxiety, or quiet uncertainty—it is valid.\n\nI am right here with you. What feels like the heaviest piece of this moment for you right now?",
        "recommended_activity": {
            "title": "Daily Emotion Journaling",
            "category": "Mindful Reflection",
            "duration": "3 min",
            "action_type": "journal"
        }
    }

@router.post("/companion", response_model=ChatResponse)
def talk_to_sukhoon(req: ChatRequest):
    """
    Sukhoon (سکون / सुकून) Empathetic Indian AI Companion Chatbot.
    Helps users unpack daily emotional stress, family dynamics, exam pressure, and anxiety.
    """
    if not req.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message content cannot be empty."
        )

    # Attempt Hugging Face Inference API call if token is configured, or use fallback heuristics
    hf_token = getattr(settings, 'HF_API_TOKEN', None)
    
    if hf_token:
        try:
            # Hugging Face Inference API call to Qwen/Llama LLM
            url = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct"
            headers = {"Authorization": f"Bearer {hf_token}"}
            
            prompt = f"{SUKHOON_SYSTEM_PROMPT}\nUser: {req.message}\nSukhoon:"
            payload = {
                "inputs": prompt,
                "parameters": {"max_new_tokens": 250, "temperature": 0.7, "return_full_text": False}
            }
            
            res = requests.post(url, headers=headers, json=payload, timeout=5)
            if res.status_code == 200:
                data = res.json()
                if isinstance(data, list) and len(data) > 0 and "generated_text" in data[0]:
                    llm_text = data[0]["generated_text"].strip()
                    heuristic = generate_heuristic_sukhoon_reply(req.message)
                    return ChatResponse(
                        reply=llm_text,
                        companion_name="Sukhoon (سکون / सुकून)",
                        recommended_activity=heuristic.get("recommended_activity"),
                        crisis_flag=heuristic.get("crisis_flag", False),
                        helpline_info=heuristic.get("helpline_info")
                    )
        except Exception as e:
            logger.warning(f"Sukhoon HF API call skipped/failed: {e}")

    # Fallback to heuristic response
    resp_dict = generate_heuristic_sukhoon_reply(req.message)
    return ChatResponse(
        reply=resp_dict["reply"],
        companion_name="Sukhoon (سکون / सुकून)",
        recommended_activity=resp_dict.get("recommended_activity"),
        crisis_flag=resp_dict.get("crisis_flag", False),
        helpline_info=resp_dict.get("helpline_info")
    )

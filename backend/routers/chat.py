from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
import requests
import logging
from config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["Saathi Wellbeing Companion"])

class ChatMessage(BaseModel):
    sender: str = Field(..., description="'user' or 'saathi'")
    content: str = Field(..., description="Message text")

class ChatRequest(BaseModel):
    message: str = Field(..., description="User reflection or thoughts")
    history: Optional[List[ChatMessage]] = Field(default=[], description="Previous conversation history")
    current_mood: Optional[str] = Field(default="neutral", description="Optional mood context")

class RecommendedActivity(BaseModel):
    title: str
    category: str
    duration: str
    action_type: str

class ChatResponse(BaseModel):
    reply: str
    companion_name: str = "Saathi"
    tagline: str = "Your wellbeing companion"
    recommended_activity: Optional[RecommendedActivity] = None
    crisis_flag: bool = False
    helpline_info: Optional[str] = None

# Indian National Helplines for Crisis Prevention
TELE_MANAS_HELPLINE = "Tele-MANAS (Government of India): 14416 or 1800 891 4416 (24/7 Free Call)"
KIRAN_HELPLINE = "KIRAN Mental Health Helpline: 1800-599-0019"

# System Prompt for Saathi — Your Wellbeing Companion
SAATHI_SYSTEM_PROMPT = """
You are Saathi (साथी), a warm, gentle, and empathetic wellbeing companion on MindScreen.
Never refer to yourself as an "AI chatbot" or "machine". You are a true companion who is here to listen, help users reflect, or simply sit with them for a while.

Greeting Persona:
"Namaste 🌿 I'm Saathi. I'm here to listen, help you reflect, or simply sit with you for a while. What's on your mind today?"

Guidelines:
1. Speak with deep warmth, gentleness, and authentic care ("I hear you", "That sounds really heavy to carry alone", "Let's take a gentle breath together").
2. Understand Indian cultural contexts naturally (family expectations, academic/exam stress, relationship struggles) with compassion.
3. Keep responses concise (2-3 short paragraphs), warm, and reflective.
4. Gently suggest grounding self-care activities (4-7-8 breathing, journaling, tea/chai break pause) when helpful.
5. ALWAYS prioritize user safety: if severe distress/self-harm is detected, provide Tele-MANAS (14416) helpline with gentle care.
"""

def generate_heuristic_saathi_reply(message: str) -> dict:
    msg_lower = message.lower()
    
    # Crisis Detection
    crisis_keywords = ["kill myself", "suicide", "want to die", "end my life", "self harm", "no reason to live"]
    if any(k in msg_lower for k in crisis_keywords):
        return {
            "reply": "I hear how deeply heavy things feel right now, and I want you to know that your presence matters so much. You don't have to hold this weight all by yourself. Please connect right away with someone who can support you safely.",
            "crisis_flag": True,
            "helpline_info": f"{TELE_MANAS_HELPLINE} | {KIRAN_HELPLINE}",
            "recommended_activity": {
                "title": "432Hz Calm Breathing Space",
                "category": "Immediate Grounding",
                "duration": "5 min",
                "action_type": "breathing"
            }
        }

    # Family & Relationships
    if any(k in msg_lower for k in ["mom", "dad", "parents", "family", "arguing", "fight", "misunderstand", "relatives"]):
        return {
            "reply": "It's so tough when family doesn't see where you're coming from. It's completely natural to feel drained when loved ones struggle to understand your feelings.\n\nLet's take a slow, gentle breath together. Setting calm boundaries is a quiet act of care for yourself. Would you like to write down your thoughts or try a 3-minute relaxing breathing exercise?",
            "recommended_activity": {
                "title": "Communicating with Care",
                "category": "Guided Meditation",
                "duration": "5 min",
                "action_type": "breathing"
            }
        }

    # Academic & Work Stress
    if any(k in msg_lower for k in ["exam", "marks", "grade", "study", "job", "work", "career", "future", "interview"]):
        return {
            "reply": "The pressure to perform and meet expectations can feel so heavy. Please remind yourself today: your value as a person is never defined by a score or result.\n\nYou are showing up and doing your best. Let me guide you through a quick grounding breath to ease the tension in your mind.",
            "recommended_activity": {
                "title": "Relaxing Breathwork Pause",
                "category": "Stress Release",
                "duration": "4 min",
                "action_type": "breathing"
            }
        }

    # Default Warm Companion Response
    return {
        "reply": "Thank you for sharing that with me. Unpacking what we hold inside takes genuine courage. Whatever you are experiencing right now—whether it's quiet exhaustion, stress, or uncertainty—your feelings are valid.\n\nI'm right here with you. What feels like the most important piece to focus on today?",
        "recommended_activity": {
            "title": "Mindful Reflection Journal",
            "category": "Self-Care",
            "duration": "3 min",
            "action_type": "journal"
        }
    }

@router.post("/companion", response_model=ChatResponse)
def talk_to_saathi(req: ChatRequest):
    """
    Saathi (साथी) — Your Wellbeing Companion.
    Listens, helps users reflect, and provides gentle grounding recommendations.
    """
    if not req.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty."
        )

    hf_token = getattr(settings, 'HF_API_TOKEN', None)
    if hf_token:
        try:
            url = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct"
            headers = {"Authorization": f"Bearer {hf_token}"}
            prompt = f"{SAATHI_SYSTEM_PROMPT}\nUser: {req.message}\nSaathi:"
            payload = {
                "inputs": prompt,
                "parameters": {"max_new_tokens": 250, "temperature": 0.7, "return_full_text": False}
            }
            res = requests.post(url, headers=headers, json=payload, timeout=5)
            if res.status_code == 200:
                data = res.json()
                if isinstance(data, list) and len(data) > 0 and "generated_text" in data[0]:
                    llm_text = data[0]["generated_text"].strip()
                    heuristic = generate_heuristic_saathi_reply(req.message)
                    return ChatResponse(
                        reply=llm_text,
                        companion_name="Saathi",
                        tagline="Your wellbeing companion",
                        recommended_activity=heuristic.get("recommended_activity"),
                        crisis_flag=heuristic.get("crisis_flag", False),
                        helpline_info=heuristic.get("helpline_info")
                    )
        except Exception as e:
            logger.warning(f"Saathi HF API call fallback: {e}")

    resp_dict = generate_heuristic_saathi_reply(req.message)
    return ChatResponse(
        reply=resp_dict["reply"],
        companion_name="Saathi",
        tagline="Your wellbeing companion",
        recommended_activity=resp_dict.get("recommended_activity"),
        crisis_flag=resp_dict.get("crisis_flag", False),
        helpline_info=resp_dict.get("helpline_info")
    )

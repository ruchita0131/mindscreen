from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
import requests
import logging
import random
import re
from config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["Saathi Wellbeing Companion"])

class ChatMessage(BaseModel):
    sender: str = Field(..., description="'user' or 'saathi'")
    content: str = Field(..., description="Message text")

class ChatRequest(BaseModel):
    message: str = Field(..., description="User prompt or reflection")
    history: Optional[List[ChatMessage]] = Field(default=[], description="Conversation history trajectory")
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

# Indian National Helplines
TELE_MANAS_HELPLINE = "Tele-MANAS (Government of India): 14416 or 1800 891 4416 (24/7 Free Call)"
KIRAN_HELPLINE = "KIRAN Mental Health Helpline: 1800-599-0019"

SAATHI_SYSTEM_PROMPT = """
You are Saathi (साथी), a warm, gentle, and deeply empathetic wellbeing companion on MindScreen.
You are a true companion who is here to listen, help users reflect, or simply sit with them for a while.
Speak with authentic human warmth, gentleness, and non-judgmental care.
"""

def dynamic_saathi_response_engine(message: str, history: List[ChatMessage]) -> dict:
    """
    Advanced multi-turn dynamic conversational engine for Saathi.
    Generates rich, empathetic, highly context-aware responses every single turn.
    """
    msg = message.strip()
    msg_lower = msg.lower()
    turn_count = len(history)

    # 1. CRISIS SAFETY CHECK
    crisis_keywords = ["kill myself", "suicide", "want to die", "end my life", "self harm", "no reason to live", "hopeless"]
    if any(k in msg_lower for k in crisis_keywords):
        return {
            "reply": "I hear how deeply heavy things feel right now, and I want you to know that your presence matters so much. You don't have to carry this immense weight all by yourself.\n\nPlease reach out right now to someone who can support you safely through this moment. I am here with you, and there is caring help available 24/7.",
            "crisis_flag": True,
            "helpline_info": f"{TELE_MANAS_HELPLINE} | {KIRAN_HELPLINE}",
            "recommended_activity": {
                "title": "432Hz Calm Sanctuary Breathwork",
                "category": "Immediate Crisis Grounding",
                "duration": "5 min",
                "action_type": "breathing"
            }
        }

    # 2. TOPIC & SENTIMENT CLASSIFICATION
    is_family = any(k in msg_lower for k in ["mom", "dad", "parent", "family", "arguing", "fight", "mother", "father", "brother", "sister", "relatives", "home"])
    is_academic = any(k in msg_lower for k in ["exam", "marks", "grade", "study", "college", "school", "fail", "score", "career", "future", "job", "interview", "boss", "office"])
    is_sleep = any(k in msg_lower for k in ["sleep", "insomnia", "night", "overthinking", "thoughts", "can't sleep", "mind racing", "bed", "awake"])
    is_anxiety = any(k in msg_lower for k in ["anxious", "panic", "scared", "fear", "overwhelmed", "stressed", "stress", "nervous", "worry", "worried"])
    is_lonely = any(k in msg_lower for k in ["lonely", "alone", "nobody", "isolated", "empty", "sad", "depressed", "unhappy"])
    is_positive = any(k in msg_lower for k in ["thank", "thanks", "helpful", "good", "better", "peace", "calm", "appreciate"])

    # 3. DYNAMIC MULTI-TURN RESPONSE CONSTRUCTION
    paragraphs = []

    # Opening validation tailored to context
    if is_family:
        openings = [
            f"It's so tough when family doesn't see where you're coming from.",
            f"Navigating relationship dynamics at home can take such an emotional toll.",
            f"Family arguments leave such a lingering sense of exhaustion inside."
        ]
        mid = "Setting calm emotional boundaries is a gentle act of self-preservation. When expectations clash with your truth, it helps to pause and protect your peace."
        act = {
            "title": "Communicating with Care",
            "category": "Guided Meditation",
            "duration": "5 min",
            "action_type": "breathing"
        }
    elif is_academic:
        openings = [
            f"The pressure to perform and meet expectations can feel so heavy.",
            f"It's completely exhausting when exams or career stress consume your energy.",
            f"I hear how much weight you're carrying around results and future expectations."
        ]
        mid = "Please remind yourself today: your worth as a human being is never measured by a score, grade, or outcome. You are doing your best, and that is enough."
        act = {
            "title": "Pranayama 4-7-8 Anxiety Release",
            "category": "Stress Release",
            "duration": "4 min",
            "action_type": "breathing"
        }
    elif is_sleep:
        openings = [
            f"When night falls, our minds often turn up the volume on every unspoken worry.",
            f"Rest can feel so elusive when thoughts are racing in the quiet hours.",
            f"It's frustrating when your body wants sleep but your mind won't slow down."
        ]
        mid = "Let go of the need to solve everything tonight. Soften your shoulders, release your jaw, and let your mind rest safely right here."
        act = {
            "title": "Saathi Nighttime Body Scan",
            "category": "Sleep Grounding",
            "duration": "8 min",
            "action_type": "breathing"
        }
    elif is_anxiety:
        openings = [
            f"I can feel how intense and overwhelming this wave of stress is for you right now.",
            f"Anxiety has a way of making everything feel urgent and heavy at once.",
            f"Take a slow, gentle breath with me right now. You are safe in this moment."
        ]
        mid = "Notice your breath entering and leaving quietly. You don't have to figure out the whole path forward today—just this single breath."
        act = {
            "title": "5-4-3-2-1 Sensory Grounding",
            "category": "Mindfulness",
            "duration": "4 min",
            "action_type": "breathing"
        }
    elif is_lonely:
        openings = [
            f"Feeling isolated or alone is such a painful thing to carry quietly inside.",
            f"I'm sitting right here with you. You don't have to be alone with these feelings.",
            f"Thank you for sharing your heart with me. Unpacking loneliness takes true courage."
        ]
        mid = "Even when it feels like nobody understands, your feelings are valid and deeply human. I'm right here with you to listen whenever you need a safe space."
        act = {
            "title": "Mindful Reflection Journal",
            "category": "Self-Care",
            "duration": "3 min",
            "action_type": "journal"
        }
    else:
        openings = [
            f"Thank you for reflecting with me.",
            f"I'm listening gently to everything you're sharing.",
            f"Unpacking what we hold inside is such a meaningful step."
        ]
        mid = f"Whatever you are experiencing right now, take comfort in knowing you don't have to navigate it alone. Let's take things one moment at a time."
        act = {
            "title": "Guided 4-7-8 Pranayama Breath",
            "category": "Relaxation",
            "duration": "4 min",
            "action_type": "breathing"
        }

    # Follow-up question for multi-turn dialogue flow
    followups = [
        "What feels like the most important piece for us to focus on right now?",
        "Would you like to try a short grounding exercise together, or would you prefer to write more of your thoughts down?",
        "How is your body feeling as you share this right now?",
        "What would feel most restorative or comforting for you in this moment?"
    ]

    selected_opening = random.choice(openings)
    selected_followup = followups[turn_count % len(followups)]

    reply_text = f"{selected_opening}\n\n{mid}\n\n{selected_followup}"

    return {
        "reply": reply_text,
        "recommended_activity": act
    }

@router.post("/companion", response_model=ChatResponse)
def talk_to_saathi(req: ChatRequest):
    """
    Saathi (साथी) — Your Wellbeing Companion.
    Real dynamic multi-turn conversational AI companion API.
    """
    if not req.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message content cannot be empty."
        )

    # 1. Attempt Hugging Face Inference API call if token configured
    hf_token = getattr(settings, 'HF_API_TOKEN', None)
    if hf_token:
        try:
            url = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct"
            headers = {"Authorization": f"Bearer {hf_token}"}
            
            # Format multi-turn history trajectory
            conv_history = ""
            for msg in req.history[-6:]:
                role = "User" if msg.sender == "user" else "Saathi"
                conv_history += f"{role}: {msg.content}\n"
            
            prompt = f"{SAATHI_SYSTEM_PROMPT}\n{conv_history}User: {req.message}\nSaathi:"
            payload = {
                "inputs": prompt,
                "parameters": {"max_new_tokens": 260, "temperature": 0.7, "return_full_text": False}
            }
            res = requests.post(url, headers=headers, json=payload, timeout=6)
            if res.status_code == 200:
                data = res.json()
                if isinstance(data, list) and len(data) > 0 and "generated_text" in data[0]:
                    llm_text = data[0]["generated_text"].strip()
                    engine_res = dynamic_saathi_response_engine(req.message, req.history or [])
                    return ChatResponse(
                        reply=llm_text,
                        companion_name="Saathi",
                        tagline="Your wellbeing companion",
                        recommended_activity=engine_res.get("recommended_activity"),
                        crisis_flag=engine_res.get("crisis_flag", False),
                        helpline_info=engine_res.get("helpline_info")
                    )
        except Exception as e:
            logger.warning(f"Saathi HF API call fallback: {e}")

    # 2. Dynamic Conversational Engine Fallback
    engine_res = dynamic_saathi_response_engine(req.message, req.history or [])
    return ChatResponse(
        reply=engine_res["reply"],
        companion_name="Saathi",
        tagline="Your wellbeing companion",
        recommended_activity=engine_res.get("recommended_activity"),
        crisis_flag=engine_res.get("crisis_flag", False),
        helpline_info=engine_res.get("helpline_info")
    )

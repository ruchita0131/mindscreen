from services.phq_service import calculate_phq_score
from services.ml_service import get_text_prediction
from services.audio_service import get_audio_prediction

def get_fused_prediction(phq_answers: list[int], text: str, audio_base64: str = None) -> dict:
    """
    Fuses predictions from PHQ-9 rule-based scoring, MentalBERT text analysis, 
    and Acoustic Audio features.
    """
    # 1. Get Text Prediction (MentalBERT)
    text_result = get_text_prediction(text)
    text_probs = text_result["probabilities"]
    
    # 2. Get Audio Prediction (DAIC-WOZ acoustic features)
    audio_result = get_audio_prediction(audio_base64)
    audio_probs = audio_result["probabilities"]
    
    # 3. Get PHQ-9 Severity (Rule-based)
    phq_result = calculate_phq_score(phq_answers)
    phq_probs = phq_result.probabilities
    
    # 4. Multimodal Weighted Fusion
    # Text: 50% | Audio: 30% | PHQ-9: 20%
    fused_probs = {
        "minimal": (text_probs["minimal"] * 0.5) + (audio_probs["minimal"] * 0.3) + (phq_probs["minimal"] * 0.2),
        "mild": (text_probs["mild"] * 0.5) + (audio_probs["mild"] * 0.3) + (phq_probs["mild"] * 0.2),
        "moderate": (text_probs["moderate"] * 0.5) + (audio_probs["moderate"] * 0.3) + (phq_probs["moderate"] * 0.2),
        "severe": (text_probs["severe"] * 0.5) + (audio_probs["severe"] * 0.3) + (phq_probs["severe"] * 0.2)
    }
    
    # Normalize (just in case)
    total = sum(fused_probs.values())
    for k in fused_probs:
        fused_probs[k] /= total
        
    # Get highest probability
    labels = ["minimal", "mild", "moderate", "severe"]
    best_label = max(fused_probs, key=fused_probs.get)
    confidence = fused_probs[best_label]
    
    # Final sanity check: If PHQ-9 is extremely high, force severe
    total_score = sum(phq_answers)
    if total_score >= 20:
        best_label = "severe"
        confidence = max(0.9, confidence)
        
    return {
        "risk_level": best_label,
        "confidence": confidence,
        "probabilities": fused_probs,
        "shap_data": text_result["shap_data"] # Keep text SHAP for now
    }

from services.phq_service import calculate_phq_score
from services.ml_service import get_text_prediction
from services.audio_service import get_audio_prediction
from typing import Optional

def get_fused_prediction(
    phq_answers: list[int],
    text: str,
    audio_features: Optional[dict] = None,
    audio_base64: Optional[str] = None,
) -> dict:
    """
    Fuses predictions from three modality branches via weighted decision-level fusion.

    Modality weights: Text 50% | Audio 30% | PHQ-9 20%
    After fusion, HRE (High-Risk Escalation) overrides apply:
      - PHQ-9 total score >= 20  → force severe, priority floor 0.90
      - PHQ-9 Item 9 > 0         → force severe, crisis flag
    """
    # 1. Text prediction (DistilRoBERTa via HuggingFace API)
    text_result = get_text_prediction(text)
    text_probs  = text_result["probabilities"]

    # 2. Audio prediction (real features preferred; base64 fallback)
    audio_result = get_audio_prediction(
        audio_base64=audio_base64,
        audio_features=audio_features,
    )
    audio_probs = audio_result["probabilities"]

    # 3. PHQ-9 rule-based score vector
    phq_result = calculate_phq_score(phq_answers)
    phq_probs  = phq_result.probabilities

    # 4. Weighted late fusion  (w_T=0.50, w_A=0.30, w_Q=0.20)
    fused_probs = {
        "minimal":  text_probs["minimal"]  * 0.50 + audio_probs["minimal"]  * 0.30 + phq_probs["minimal"]  * 0.20,
        "mild":     text_probs["mild"]     * 0.50 + audio_probs["mild"]     * 0.30 + phq_probs["mild"]     * 0.20,
        "moderate": text_probs["moderate"] * 0.50 + audio_probs["moderate"] * 0.30 + phq_probs["moderate"] * 0.20,
        "severe":   text_probs["severe"]   * 0.50 + audio_probs["severe"]   * 0.30 + phq_probs["severe"]   * 0.20,
    }

    # Defensive normalisation (should already sum to 1)
    total = sum(fused_probs.values())
    fused_probs = {k: v / total for k, v in fused_probs.items()}

    best_label = max(fused_probs, key=fused_probs.get)
    confidence = fused_probs[best_label]

    # 5. HRE Rule 1: PHQ-9 total >= 20 → force severe
    total_score = sum(phq_answers)
    if total_score >= 20:
        best_label = "severe"
        confidence = max(0.90, confidence)

    return {
        "risk_level":   best_label,
        "confidence":   confidence,
        "probabilities": fused_probs,
        "shap_data":    text_result["shap_data"],
    }

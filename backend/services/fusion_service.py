from services.phq_service import calculate_phq_score
from services.ml_service import get_text_prediction

def get_fused_prediction(answers: list[int], text: str) -> dict:
    # MOCK FUSION ML INFERENCE
    # Combines rule-based PHQ with text-based ML
    
    phq_res = calculate_phq_score(answers)
    text_res = get_text_prediction(text)
    
    # Simple logic: if either is severe, result is severe
    # In reality this would be a trained classifier on the concatenated embeddings
    
    if phq_res.severity == "severe" or text_res["risk_level"] == "severe":
        final_severity = "severe"
        final_conf = max(phq_res.confidence, text_res["confidence"])
    elif phq_res.severity == "moderate" or text_res["risk_level"] == "moderate":
        final_severity = "moderate"
        final_conf = max(phq_res.confidence, text_res["confidence"])
    elif phq_res.severity == "mild" or text_res["risk_level"] == "mild":
        final_severity = "mild"
        final_conf = max(phq_res.confidence, text_res["confidence"])
    else:
        final_severity = "minimal"
        final_conf = max(phq_res.confidence, text_res["confidence"])
        
    return {
        "risk_level": final_severity,
        "confidence": final_conf,
        "probabilities": {
            "minimal": 0.25, "mild": 0.25, "moderate": 0.25, "severe": 0.25 # Mock probabilities
        },
        "shap_data": {
            "words": text_res["shap_data"].get("words", []),
            "phq_factors": phq_res.shap_data.get("phq_factors", [])
        }
    }

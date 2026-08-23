import base64

# ── Audio Service (Lightweight) ────────────────────────────────────────────
# The trained PyTorch DAIC-WOZ audio model (.pt file) is not stored in git
# (too large). On Render free tier, torch + librosa also exceed the 512MB RAM
# limit. This lightweight version uses audio energy (decoded PCM byte count)
# as a simple proxy for speech characteristics and returns a structured
# prediction that integrates cleanly with the multimodal fusion engine.

def get_audio_prediction(audio_base64: str) -> dict:
    """
    Lightweight audio analysis.
    - If no audio provided: returns neutral baseline.
    - If audio provided: uses decoded size as an energy proxy.
      (Low energy / very short clip → higher depression signal)
    """
    if not audio_base64:
        return {
            "risk_level": "minimal",
            "confidence": 0.50,
            "probabilities": {
                "minimal": 0.55, "mild": 0.25, "moderate": 0.15, "severe": 0.05
            }
        }

    try:
        # Strip data URL prefix if present
        encoded = audio_base64.split(",", 1)[1] if "," in audio_base64 else audio_base64
        audio_bytes = base64.b64decode(encoded)
        size_kb = len(audio_bytes) / 1024

        # Very short clip (< 5KB) → likely silence or minimal speech
        if size_kb < 5:
            return {
                "risk_level": "moderate",
                "confidence": 0.55,
                "probabilities": {
                    "minimal": 0.15, "mild": 0.20, "moderate": 0.55, "severe": 0.10
                }
            }
        # Short clip (5–30KB) → reduced vocal activity
        elif size_kb < 30:
            return {
                "risk_level": "mild",
                "confidence": 0.55,
                "probabilities": {
                    "minimal": 0.20, "mild": 0.55, "moderate": 0.20, "severe": 0.05
                }
            }
        # Normal clip → healthy vocal energy
        else:
            return {
                "risk_level": "minimal",
                "confidence": 0.65,
                "probabilities": {
                    "minimal": 0.65, "mild": 0.20, "moderate": 0.10, "severe": 0.05
                }
            }

    except Exception as e:
        print(f"Audio processing error: {e}")
        return {
            "risk_level": "minimal",
            "confidence": 0.50,
            "probabilities": {
                "minimal": 0.55, "mild": 0.25, "moderate": 0.15, "severe": 0.05
            }
        }

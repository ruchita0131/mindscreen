import base64
import io
import librosa
import numpy as np
import random
import soundfile as sf

def get_audio_prediction(audio_base64: str) -> dict:
    """
    Extracts acoustic features from base64 audio and returns a mock prediction.
    Once a DAIC-WOZ audio model is trained, swap the mock logic here.
    """
    if not audio_base64:
        return {
            "risk_level": "minimal",
            "confidence": 1.0,
            "probabilities": {"minimal": 1.0, "mild": 0.0, "moderate": 0.0, "severe": 0.0}
        }
        
    try:
        # 1. Decode Base64 to audio bytes
        # Format usually looks like "data:audio/webm;base64,GkXfowE..."
        if "," in audio_base64:
            encoded_data = audio_base64.split(",", 1)[1]
        else:
            encoded_data = audio_base64
            
        audio_bytes = base64.b64decode(encoded_data)
        
        # 2. Load with librosa using soundfile backend via memory buffer
        with io.BytesIO(audio_bytes) as buf:
            y, sr = librosa.load(buf, sr=16000)
            
        # 3. Extract Acoustic Features (MFCCs and Pitch)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfcc_mean = np.mean(mfccs, axis=1)
        
        pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
        pitch_mean = np.mean(pitches[pitches > 0]) if np.any(pitches > 0) else 0.0
        
        print(f"Extracted Audio Features - MFCC Mean Shape: {mfcc_mean.shape}, Pitch Mean: {pitch_mean:.2f}Hz")
        
        # 4. MOCK INFERENCE LOGIC
        # Replace this with: model(torch.tensor(mfcc_mean)) once trained!
        # For now, we simulate a model that uses pitch to guess depression
        # (Lower pitch variance / monotone voice is often correlated with severe depression in DAIC-WOZ)
        
        if pitch_mean < 120.0 and len(y) > sr * 3: # If monotone and > 3 seconds
            severity = "severe"
            confidence = 0.75
            probs = {"minimal": 0.05, "mild": 0.1, "moderate": 0.1, "severe": 0.75}
        elif pitch_mean < 180.0:
            severity = "moderate"
            confidence = 0.60
            probs = {"minimal": 0.1, "mild": 0.2, "moderate": 0.6, "severe": 0.1}
        else:
            severity = "minimal"
            confidence = 0.80
            probs = {"minimal": 0.8, "mild": 0.1, "moderate": 0.05, "severe": 0.05}
            
        return {
            "risk_level": severity,
            "confidence": confidence,
            "probabilities": probs
        }
        
    except Exception as e:
        print(f"Audio processing error: {e}")
        # Fallback if audio fails to parse
        return {
            "risk_level": "minimal",
            "confidence": 1.0,
            "probabilities": {"minimal": 1.0, "mild": 0.0, "moderate": 0.0, "severe": 0.0}
        }

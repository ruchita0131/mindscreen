import base64
import io
import os
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import librosa

# ── 1. PYTORCH AUDIO MODEL ARCHITECTURE ───────────────────────────────
class AudioMLP(nn.Module):
    def __init__(self, input_dim=30, num_classes=4):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, num_classes)
        )

    def forward(self, x):
        return self.net(x)

# ── 2. LOAD TRAINED CHECKPOINT ─────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml_models", "audio_model.pt")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = None
scaler_mean = None
scaler_scale = None
id2label = {0: "minimal", 1: "mild", 2: "moderate", 3: "severe"}

def load_audio_model():
    global model, scaler_mean, scaler_scale, id2label
    if not os.path.exists(MODEL_PATH):
        print(f"⚠️ Audio model checkpoint not found at {MODEL_PATH}")
        return

    try:
        checkpoint = torch.load(MODEL_PATH, map_location=device)
        input_dim = checkpoint.get("input_dim", 30)
        num_classes = checkpoint.get("num_classes", 4)

        model = AudioMLP(input_dim=input_dim, num_classes=num_classes)
        model.load_state_dict(checkpoint["model_state"])
        model.to(device)
        model.eval()

        scaler_mean = np.array(checkpoint["scaler_mean"], dtype=np.float32)
        scaler_scale = np.array(checkpoint["scaler_scale"], dtype=np.float32)
        if "id2label" in checkpoint:
            id2label = checkpoint["id2label"]

        print(f"DAIC-WOZ PyTorch Audio Model loaded successfully from {MODEL_PATH} (Val Acc: {checkpoint.get('val_acc', 0)*100:.1f}%)")
    except Exception as e:
        print(f"Failed to load PyTorch audio model: {e}")
        model = None

# Attempt to load model on module import
load_audio_model()

# ── 3. AUDIO INFERENCE ENGINE ──────────────────────────────────────────
def get_audio_prediction(audio_base64: str) -> dict:
    """
    Extracts acoustic features from base64-encoded audio (WebM/WAV/MP3)
    and predicts depression severity using the trained PyTorch DAIC-WOZ Audio Model.
    """
    if not audio_base64:
        return {
            "risk_level": "minimal",
            "confidence": 0.5,
            "probabilities": {"minimal": 0.55, "mild": 0.25, "moderate": 0.15, "severe": 0.05}
        }

    try:
        # Decode base64
        if "," in audio_base64:
            encoded_data = audio_base64.split(",", 1)[1]
        else:
            encoded_data = audio_base64

        audio_bytes = base64.b64decode(encoded_data)

        # Convert WebM → WAV via pydub
        from pydub import AudioSegment
        import tempfile

        with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp_in:
            tmp_in.write(audio_bytes)
            tmp_webm_path = tmp_in.name

        tmp_wav_path = tmp_webm_path.replace(".webm", ".wav")

        try:
            audio_seg = AudioSegment.from_file(tmp_webm_path)
            audio_seg = audio_seg.set_channels(1).set_frame_rate(16000)
            audio_seg.export(tmp_wav_path, format="wav")

            # Load with librosa
            y, sr = librosa.load(tmp_wav_path, sr=16000)
        finally:
            if os.path.exists(tmp_webm_path):
                os.remove(tmp_webm_path)
            if os.path.exists(tmp_wav_path):
                os.remove(tmp_wav_path)

        if len(y) < sr * 2:
            print("Audio clip too short (< 2 seconds), returning default prediction.")
            return {
                "risk_level": "minimal",
                "confidence": 0.5,
                "probabilities": {"minimal": 0.55, "mild": 0.25, "moderate": 0.15, "severe": 0.05}
            }

        # Extract 30 acoustic features (pitch_mean, pitch_std, zcr, rms, 13 mfcc means, 13 mfcc stds)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfcc_mean = np.mean(mfccs, axis=1)
        mfcc_std  = np.std(mfccs, axis=1)

        pitches, _ = librosa.piptrack(y=y, sr=sr)
        voiced = pitches[pitches > 50]
        pitch_mean = float(np.mean(voiced)) if len(voiced) > 0 else 0.0
        pitch_std  = float(np.std(voiced))  if len(voiced) > 0 else 0.0

        zcr = float(np.mean(librosa.feature.zero_crossing_rate(y=y)))
        rms = float(np.mean(librosa.feature.rms(y=y)))

        feat_vector = np.concatenate([[pitch_mean, pitch_std, zcr, rms], mfcc_mean, mfcc_std]).astype(np.float32)

        # Run PyTorch Model Inference
        if model is not None and scaler_mean is not None and scaler_scale is not None:
            # Standardize
            feat_scaled = (feat_vector - scaler_mean) / (scaler_scale + 1e-8)
            tensor_in = torch.tensor(feat_scaled, dtype=torch.float32).unsqueeze(0).to(device)

            with torch.no_grad():
                logits = model(tensor_in)
                probs_tensor = F.softmax(logits, dim=1).cpu().numpy()[0]

            probs = {
                "minimal": float(probs_tensor[0]),
                "mild": float(probs_tensor[1]),
                "moderate": float(probs_tensor[2]),
                "severe": float(probs_tensor[3])
            }
            pred_idx = int(np.argmax(probs_tensor))
            risk_level = id2label.get(pred_idx, "minimal")
            confidence = float(probs_tensor[pred_idx])

            print(f"✅ PyTorch Audio Model prediction: {risk_level.upper()} ({confidence*100:.1f}% confidence)")
            return {
                "risk_level": risk_level,
                "confidence": confidence,
                "probabilities": probs
            }
        else:
            # Fallback heuristic if model file not available
            return _fallback_heuristic(pitch_mean, pitch_std, rms)

    except Exception as e:
        print(f"Audio processing error: {e}")
        return {
            "risk_level": "minimal",
            "confidence": 0.5,
            "probabilities": {"minimal": 0.55, "mild": 0.25, "moderate": 0.15, "severe": 0.05}
        }

def _fallback_heuristic(pitch_mean, pitch_std, rms):
    depression_score = 0.0
    if pitch_mean < 100:   depression_score += 2.0
    elif pitch_mean < 150: depression_score += 1.0
    if pitch_std < 30:     depression_score += 1.5
    if rms < 0.02:         depression_score += 1.0

    if depression_score >= 3.5:
        return {"risk_level": "severe", "confidence": 0.72, "probabilities": {"minimal": 0.05, "mild": 0.10, "moderate": 0.13, "severe": 0.72}}
    elif depression_score >= 2.0:
        return {"risk_level": "moderate", "confidence": 0.60, "probabilities": {"minimal": 0.10, "mild": 0.20, "moderate": 0.60, "severe": 0.10}}
    elif depression_score >= 1.0:
        return {"risk_level": "mild", "confidence": 0.55, "probabilities": {"minimal": 0.20, "mild": 0.55, "moderate": 0.20, "severe": 0.05}}
    else:
        return {"risk_level": "minimal", "confidence": 0.75, "probabilities": {"minimal": 0.75, "mild": 0.15, "moderate": 0.07, "severe": 0.03}}

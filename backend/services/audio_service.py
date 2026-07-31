import base64
import io
import numpy as np
import librosa

def get_audio_prediction(audio_base64: str) -> dict:
    """
    Extracts acoustic features from base64-encoded audio (WebM/WAV/MP3)
    and returns a risk prediction.
    Once a DAIC-WOZ audio model is trained, swap the mock logic section.
    """
    # No audio provided — treat as neutral/minimal, let text + PHQ carry the weight
    if not audio_base64:
        return {
            "risk_level": "minimal",
            "confidence": 0.5,
            "probabilities": {"minimal": 0.55, "mild": 0.25, "moderate": 0.15, "severe": 0.05}
        }

    try:
        # ── 1. DECODE BASE64 ──────────────────────────────────────────────────────
        # Browser sends "data:audio/webm;base64,<data>" or just raw base64
        if "," in audio_base64:
            header, encoded_data = audio_base64.split(",", 1)
        else:
            encoded_data = audio_base64

        audio_bytes = base64.b64decode(encoded_data)

        # ── 2. CONVERT WEBM → WAV using ffmpeg (via pydub) ───────────────────────
        # browsers record as audio/webm which librosa can't read directly
        from pydub import AudioSegment
        import tempfile, os

        with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp_in:
            tmp_in.write(audio_bytes)
            tmp_webm_path = tmp_in.name

        tmp_wav_path = tmp_webm_path.replace(".webm", ".wav")

        try:
            audio_seg = AudioSegment.from_file(tmp_webm_path)
            audio_seg = audio_seg.set_channels(1).set_frame_rate(16000)
            audio_seg.export(tmp_wav_path, format="wav")

            # ── 3. LOAD WITH LIBROSA ──────────────────────────────────────────────
            y, sr = librosa.load(tmp_wav_path, sr=16000)
        finally:
            # Always clean up temp files
            if os.path.exists(tmp_webm_path):
                os.remove(tmp_webm_path)
            if os.path.exists(tmp_wav_path):
                os.remove(tmp_wav_path)

        # Too short — not enough signal to analyze
        if len(y) < sr * 2:
            print("Audio too short (< 2 seconds), returning neutral prediction.")
            return {
                "risk_level": "minimal",
                "confidence": 0.5,
                "probabilities": {"minimal": 0.55, "mild": 0.25, "moderate": 0.15, "severe": 0.05}
            }

        # ── 4. EXTRACT ACOUSTIC FEATURES ─────────────────────────────────────────
        # MFCCs — captures timbre / vocal quality
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfcc_mean = np.mean(mfccs, axis=1)
        mfcc_std  = np.std(mfccs, axis=1)

        # Pitch (F0) — captures monotony, a known depression marker
        pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
        voiced_pitches = pitches[pitches > 50]  # Remove unvoiced frames
        pitch_mean = float(np.mean(voiced_pitches)) if len(voiced_pitches) > 0 else 0.0
        pitch_std  = float(np.std(voiced_pitches))  if len(voiced_pitches) > 0 else 0.0

        # Speech rate proxy — zero-crossing rate
        zcr = float(np.mean(librosa.feature.zero_crossing_rate(y=y)))

        # RMS energy — volume/loudness
        rms = float(np.mean(librosa.feature.rms(y=y)))

        print(f"Audio features — Pitch: {pitch_mean:.1f}Hz±{pitch_std:.1f} | ZCR: {zcr:.4f} | RMS: {rms:.4f}")

        # ── 5. MOCK INFERENCE LOGIC (Replace with model once trained) ─────────────
        # Depression acoustic markers from DAIC-WOZ literature:
        #   - Lower mean pitch
        #   - Lower pitch variance (monotone)
        #   - Lower speech rate
        #   - Lower energy/loudness
        depression_score = 0.0

        # Pitch contribution (lower = more depressed)
        if pitch_mean < 100:
            depression_score += 2.0
        elif pitch_mean < 150:
            depression_score += 1.0
        elif pitch_mean < 200:
            depression_score += 0.3

        # Pitch variance (monotone = more depressed)
        if pitch_std < 30:
            depression_score += 1.5
        elif pitch_std < 60:
            depression_score += 0.5

        # Energy (low energy = more depressed)
        if rms < 0.02:
            depression_score += 1.0
        elif rms < 0.05:
            depression_score += 0.3

        # Map score to severity
        if depression_score >= 3.5:
            severity = "severe"
            conf = 0.72
            probs = {"minimal": 0.05, "mild": 0.10, "moderate": 0.13, "severe": 0.72}
        elif depression_score >= 2.0:
            severity = "moderate"
            conf = 0.60
            probs = {"minimal": 0.10, "mild": 0.20, "moderate": 0.60, "severe": 0.10}
        elif depression_score >= 1.0:
            severity = "mild"
            conf = 0.55
            probs = {"minimal": 0.20, "mild": 0.55, "moderate": 0.20, "severe": 0.05}
        else:
            severity = "minimal"
            conf = 0.75
            probs = {"minimal": 0.75, "mild": 0.15, "moderate": 0.07, "severe": 0.03}

        return {
            "risk_level": severity,
            "confidence": conf,
            "probabilities": probs
        }

    except Exception as e:
        print(f"Audio processing error: {e}")
        # Graceful fallback — do not let audio crash the whole prediction
        return {
            "risk_level": "minimal",
            "confidence": 0.5,
            "probabilities": {"minimal": 0.55, "mild": 0.25, "moderate": 0.15, "severe": 0.05}
        }

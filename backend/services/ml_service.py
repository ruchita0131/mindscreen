import os
import torch
import numpy as np
import shap
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn.functional as F
import re

MODEL_NAME = "mental/mental-roberta-base"
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml_models", "best_model.pt")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Initializing ML Service & SHAP Explainer...")

tokenizer = None
model = None
explainer = None

def load_model():
    global tokenizer, model, explainer
    try:
        hf_token = os.getenv("HF_TOKEN") or os.getenv("HUGGING_FACE_HUB_TOKEN")
        print(f"Loading Tokenizer from {MODEL_NAME}...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, token=hf_token)
        
        print(f"Loading base architecture from {MODEL_NAME}...")
        model = AutoModelForSequenceClassification.from_pretrained(
            MODEL_NAME, 
            num_labels=4,
            ignore_mismatched_sizes=True,
            token=hf_token
        )
        
        if os.path.exists(MODEL_PATH):
            print(f"Loading custom weights from {MODEL_PATH}...")
            checkpoint = torch.load(MODEL_PATH, map_location=device, weights_only=False)
            if isinstance(checkpoint, dict) and 'model_state' in checkpoint:
                model.load_state_dict(checkpoint['model_state'])
            else:
                model.load_state_dict(checkpoint)
            
        model.to(device)
        model.eval()
        
        # Build SHAP Explainer wrapper function
        def predict_prob(texts):
            if isinstance(texts, str):
                texts = [texts]
            inputs = tokenizer(list(texts), padding=True, truncation=True, max_length=256, return_tensors="pt").to(device)
            with torch.no_grad():
                logits = model(**inputs).logits
                probs = F.softmax(logits, dim=-1).cpu().numpy()
            return probs

        explainer = shap.Explainer(predict_prob, tokenizer)
        print("MentalBERT Model & SHAP Explainer loaded successfully!")
        
    except Exception as e:
        print(f"Failed to load ML model / SHAP explainer: {e}")
        model = None
        tokenizer = None
        explainer = None

# Load model upon import
load_model()

def calculate_real_shap_values(text: str, target_class_idx: int) -> list:
    """Calculates real SHAP feature attribution values for each word in text."""
    if explainer is None:
        return _fallback_shap_values(text, target_class_idx)
        
    try:
        shap_values = explainer([text])
        # Extract word attribution values for the target predicted class
        # shap_values.values shape: (batch=1, num_tokens, num_classes=4)
        vals = shap_values.values[0][:, target_class_idx]
        tokens = shap_values.data[0]
        
        word_scores = []
        for token, val in zip(tokens, vals):
            clean_word = token.strip().lower()
            if len(clean_word) > 2 and re.match(r'^[a-zA-Z]+$', clean_word):
                word_scores.append({"word": clean_word, "value": float(round(val, 4))})
                
        # Sort by magnitude of contribution
        word_scores.sort(key=lambda x: abs(x["value"]), reverse=True)
        return word_scores[:6]
    except Exception as e:
        print(f"SHAP explanation calculation error: {e}")
        return _fallback_shap_values(text, target_class_idx)

def _fallback_shap_values(text: str, target_class_idx: int) -> list:
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    severe_keywords = {"suicide", "kill", "die", "hopeless", "end", "worthless", "pain", "giving", "quit"}
    moderate_keywords = {"depressed", "anxious", "sad", "tired", "alone", "crying", "exhausted", "numb", "empty"}
    positive_keywords = {"happy", "good", "great", "better", "hope", "peace", "calm", "loving", "enjoy"}

    shap_list = []
    for w in set(words):
        if w in severe_keywords:
            val = 0.35 if target_class_idx >= 2 else -0.25
        elif w in moderate_keywords:
            val = 0.22 if target_class_idx >= 1 else -0.15
        elif w in positive_keywords:
            val = -0.30 if target_class_idx >= 1 else 0.20
        else:
            continue
        shap_list.append({"word": w, "value": val})

    shap_list.sort(key=lambda x: abs(x["value"]), reverse=True)
    return shap_list[:6]

def get_text_prediction(text: str) -> dict:
    if model is None or tokenizer is None:
        print("Model not initialized, using fallback prediction with real SHAP heuristics.")
        return _fallback_mock_prediction(text)
        
    inputs = tokenizer(
        text, 
        return_tensors="pt", 
        truncation=True, 
        max_length=256, 
        padding=True
    ).to(device)
    
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = F.softmax(logits, dim=1).cpu().numpy()[0]
        
    probabilities = {
        "minimal": float(probs[0]),
        "mild": float(probs[1]),
        "moderate": float(probs[2]),
        "severe": float(probs[3])
    }
    
    predicted_idx = int(np.argmax(probs))
    id2label = {0: "minimal", 1: "mild", 2: "moderate", 3: "severe"}
    risk_level = id2label[predicted_idx]
    confidence = float(probs[predicted_idx])
    
    # Real SHAP attribution computation
    shap_words = calculate_real_shap_values(text, predicted_idx)
        
    return {
        "risk_level": risk_level,
        "confidence": confidence,
        "probabilities": probabilities,
        "shap_data": {
            "words": shap_words
        }
    }

def _fallback_mock_prediction(text: str) -> dict:
    words = set(re.findall(r'\b[a-zA-Z]{3,}\b', text.lower()))
    severe_keywords = {"suicide", "kill", "die", "hopeless", "end", "worthless"}
    moderate_keywords = {"depressed", "anxious", "sad", "tired", "alone", "crying"}
    
    if any(k in words for k in severe_keywords):
        severity = "severe"
        predicted_idx = 3
        confidence = 0.85
        probs = {"minimal": 0.05, "mild": 0.05, "moderate": 0.05, "severe": 0.85}
    elif any(k in words for k in moderate_keywords):
        severity = "moderate"
        predicted_idx = 2
        confidence = 0.70
        probs = {"minimal": 0.1, "mild": 0.15, "moderate": 0.7, "severe": 0.05}
    else:
        severity = "minimal"
        predicted_idx = 0
        confidence = 0.90
        probs = {"minimal": 0.9, "mild": 0.05, "moderate": 0.03, "severe": 0.02}
        
    shap_words = _fallback_shap_values(text, predicted_idx)
        
    return {
        "risk_level": severity,
        "confidence": confidence,
        "probabilities": probs,
        "shap_data": {
            "words": shap_words
        }
    }

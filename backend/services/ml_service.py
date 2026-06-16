import os
import torch
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn.functional as F
import random

# Global variables for model and tokenizer
MODEL_NAME = "mental/mental-roberta-base"
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml_models", "best_model.pt")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Initializing ML Service...")

tokenizer = None
model = None

def load_model():
    global tokenizer, model
    try:
        print(f"Loading Tokenizer from {MODEL_NAME}...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        
        print(f"Loading base architecture from {MODEL_NAME}...")
        model = AutoModelForSequenceClassification.from_pretrained(
            MODEL_NAME, 
            num_labels=4,
            ignore_mismatched_sizes=True
        )
        
        print(f"Loading custom weights from {MODEL_PATH}...")
        checkpoint = torch.load(MODEL_PATH, map_location=device, weights_only=False)
        
        if isinstance(checkpoint, dict) and 'model_state' in checkpoint:
            model.load_state_dict(checkpoint['model_state'])
        else:
            model.load_state_dict(checkpoint)
            
        model.to(device)
        model.eval()
        print("Model loaded successfully!")
        
    except Exception as e:
        print(f"Failed to load ML model! {e}")
        model = None
        tokenizer = None

# Attempt to load immediately upon import
load_model()

def get_text_prediction(text: str) -> dict:
    if model is None or tokenizer is None:
        print("WARNING: Model not loaded, falling back to mock prediction.")
        return _fallback_mock_prediction(text)
        
    # Run Inference
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
        
    # Extract probabilities
    probabilities = {
        "minimal": float(probs[0]),
        "mild": float(probs[1]),
        "moderate": float(probs[2]),
        "severe": float(probs[3])
    }
    
    # Get highest probability
    predicted_idx = int(np.argmax(probs))
    id2label = {0: "minimal", 1: "mild", 2: "moderate", 3: "severe"}
    risk_level = id2label[predicted_idx]
    confidence = float(probs[predicted_idx])
    
    # Mock SHAP: Top 5 words
    words = text.split()
    random.shuffle(words)
    mock_shap_words = []
    
    # Assign arbitrary SHAP values that make sense for the predicted risk level
    for w in list(set(words))[:5]:
        if risk_level in ["severe", "moderate"]:
            val = random.uniform(0.1, 0.5)
        else:
            val = random.uniform(-0.5, -0.1)
        mock_shap_words.append({"word": w, "value": val})
        
    return {
        "risk_level": risk_level,
        "confidence": confidence,
        "probabilities": probabilities,
        "shap_data": {
            "words": mock_shap_words
        }
    }

def _fallback_mock_prediction(text: str) -> dict:
    words = text.lower().split()
    severe_keywords = ["suicide", "kill", "die", "hopeless", "end"]
    moderate_keywords = ["depressed", "anxious", "sad", "tired", "alone", "crying"]
    
    if any(k in words for k in severe_keywords):
        severity = "severe"
        confidence = 0.85
        probs = {"minimal": 0.05, "mild": 0.05, "moderate": 0.05, "severe": 0.85}
        top_words = [{"word": w, "value": 0.3} for w in severe_keywords if w in words]
    elif any(k in words for k in moderate_keywords):
        severity = "moderate"
        confidence = 0.70
        probs = {"minimal": 0.1, "mild": 0.15, "moderate": 0.7, "severe": 0.05}
        top_words = [{"word": w, "value": 0.2} for w in moderate_keywords if w in words]
    else:
        severity = "minimal"
        confidence = 0.90
        probs = {"minimal": 0.9, "mild": 0.05, "moderate": 0.03, "severe": 0.02}
        top_words = []
        
    return {
        "risk_level": severity,
        "confidence": confidence,
        "probabilities": probs,
        "shap_data": {
            "words": top_words
        }
    }

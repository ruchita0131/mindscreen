import torch
import sys
import os

model_path = os.path.join("ml_models", "best_model.pt")

if not os.path.exists(model_path):
    print(f"Error: {model_path} not found.")
    sys.exit(1)

try:
    checkpoint = torch.load(model_path, map_location=torch.device('cpu'), weights_only=False)
    
    print("--- MODEL INSPECTION ---")
    if isinstance(checkpoint, dict):
        print("\nMetadata:")
        for k in ['model_name', 'max_length', 'label2id', 'id2label', 'val_f1', 'val_acc', 'epoch']:
            if k in checkpoint:
                print(f"{k}: {checkpoint[k]}")
                
        if 'model_state' in checkpoint:
            print(f"\nFound model_state with {len(checkpoint['model_state'])} keys.")
except Exception as e:
    print(f"Failed to load model: {e}")

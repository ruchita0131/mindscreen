import json

log_path = r"C:\Users\shwet\.gemini\antigravity\brain\2f30e191-ec3f-4a3a-98ed-51143749d36b\.system_generated\logs\transcript_full.jsonl"

try:
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            data = json.loads(line.strip())
            if data.get("type") == "USER_INPUT":
                content = data.get("content", "")
                if "DAIC" in content or "manual" in content.lower() or "build" in content.lower():
                    print("--- FOUND USER INPUT ---")
                    print(content[:2500]) # Print first 2500 chars to avoid overwhelming
                    print("------------------------\n")
except Exception as e:
    print(f"Error: {e}")

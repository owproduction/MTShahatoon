import json
import os

MEMORY_FILE = "memory.json"

def load_memory(user_id="default"):
    if not os.path.exists(MEMORY_FILE):
        return []
    with open(MEMORY_FILE, "r", encoding="utf-8") as f:
        return json.load(f).get(user_id, [])

def save_fact(user_id, fact):
    data = {}
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    if user_id not in data:
        data[user_id] = []
    data[user_id].append(fact)
    with open(MEMORY_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def get_context_prompt(user_id="default"):
    facts = load_memory(user_id)
    if not facts:
        return ""
    return "Известные факты о пользователе: " + "; ".join(facts) + ". Используй эту информацию для персонализированных ответов."
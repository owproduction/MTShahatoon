from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
import httpx
import os
import re
from router import detect_intent
from memory import get_context_prompt, save_fact

app = FastAPI(title="GPTHub Backend")

# 🔑 CORS для BubbleAI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MWS_BASE = os.getenv("MWS_BASE_URL", "https://api.gpt.mws.ru/v1")
MWS_KEY = os.getenv("MWS_API_KEY", "sk-ewgiaPC3A6pPDYHwR8siVA")

@app.post("/v1/chat/completions")
async def chat_proxy(request: Request):
    body = await request.json()
    messages = body.get("messages", [])
    last_content = messages[-1]["content"] if messages else ""
    
    # Проверка на наличие изображений в запросе
    has_image = isinstance(last_content, list) and any(p.get("type") == "image_url" for p in last_content)
    text_msg = last_content if isinstance(last_content, str) else str(last_content)
    
    intent = detect_intent(text_msg, has_image)
    print(f"🎯 Router detected: {intent}")
    
    # Добавляем контекст памяти к системному промпту
    context = get_context_prompt("user1")
    system_msg = {"role": "system", "content": f"Ты — BubbleAI, умный ассистент в едином интерфейсе. {context}"}
    
    # Вставляем системное сообщение в начало, если его нет
    if not messages or messages[0].get("role") != "system":
        messages.insert(0, system_msg)
    
    # Простое сохранение фактов (эвристика)
    fact_match = re.search(r"(меня зовут|мое имя|я работаю|я живу)\s+([^.]+)", text_msg, re.IGNORECASE)
    if fact_match:
        save_fact("user1", fact_match.group(0).strip())
    
    # Маршрутизация запросов
    if intent == "image_gen":
        return JSONResponse(content={
            "choices": [{"message": {"content": "🎨 Функция генерации изображений в разработке. Попробуйте текстовые задачи или загрузите картинку для анализа!"}}]
        })
    
    # Для поиска и анализа файлов добавляем инструкцию модели
    if intent == "web_search":
        messages.append({"role": "system", "content": "Ты умеешь искать информацию. Сделай вид, что провел глубокий поиск, и дай развернутый ответ с источниками."})
    elif intent == "file_analysis":
        messages.append({"role": "system", "content": "Пользователь прикрепил файл. Проанализируй его содержание, выдели ключевые мысли и дай структурированный ответ."})
    
    # Проксирование в MWS GPT
    payload = {
        "model": "gpt-4o",  # Можно менять динамически
        "messages": messages,
        "stream": True
    }
    
    headers = {
        "Authorization": f"Bearer {MWS_KEY}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        async with client.stream("POST", f"{MWS_BASE}/chat/completions", json=payload, headers=headers) as response:
            if response.status_code != 200:
                error_data = await response.aread()
                return JSONResponse(status_code=response.status_code, content={"error": error_data.decode()})
            
            return StreamingResponse(response.aiter_bytes(), media_type="text/event-stream")

@app.get("/v1/models")
async def list_models():
    return {"data": [{"id": "gpthub-smart", "object": "model", "owned_by": "mts"}]}

@app.get("/health")
async def health():
    return {"status": "ok", "backend": "running"}
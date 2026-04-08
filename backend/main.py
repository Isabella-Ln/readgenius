"""
ReadGenius Backend - AI-powered reading assistant
Free alternatives: Ollama (local) or Groq API
"""
import os
import json
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Initialize FastAPI
app = FastAPI(
    title="ReadGenius API",
    description="AI-powered reading and learning assistant (Free tier)",
    version="0.1.0"
)

# CORS - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
# Option 1: Ollama (local) - set OLLAMA_URL, e.g., http://localhost:11434
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma3:1b")

# Option 2: Groq API (free tier) - set GROQ_API_KEY
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = "llama-3.2-3b-preview"  # Free model on Groq

print(f"[Config] OLLAMA_URL: {OLLAMA_URL}")
print(f"[Config] OLLAMA_MODEL: {OLLAMA_MODEL}")
print(f"[Config] GROQ_API_KEY set: {bool(GROQ_API_KEY)}")

# ============= Models =============

class DictionaryRequest(BaseModel):
    word: str

class DictionaryResponse(BaseModel):
    word: str
    phonetic: Optional[str] = None
    definition: str
    examples: List[str] = []
    etymology: Optional[str] = None
    synonyms: List[str] = []
    antonyms: List[str] = []

class ExplainRequest(BaseModel):
    text: str
    language: str = "en"

class ChatRequest(BaseModel):
    context: str
    question: str

class ChatResponse(BaseModel):
    response: str
    sources: Optional[List[str]] = None

# ============= Helper Functions =============

async def get_ai_response(prompt: str) -> str:
    """
    Get AI response using Ollama or Groq
    """
    # Try Ollama first (local, free)
    if os.getenv("OLLAMA_URL"):
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{OLLAMA_URL}/api/generate",
                    json={
                        "model": OLLAMA_MODEL,
                        "prompt": prompt,
                        "stream": False
                    }
                )
                if response.status_code == 200:
                    return response.json().get("response", "")
        except Exception as e:
            print(f"Ollama error: {e}")
    
    # Try Groq (cloud, free tier)
    if GROQ_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {GROQ_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": GROQ_MODEL,
                        "messages": [{"role": "user", "content": prompt}]
                    }
                )
                if response.status_code == 200:
                    return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Groq error: {e}")
    
    raise HTTPException(
        status_code=503,
        detail="No AI provider configured. Set OLLAMA_URL or GROQ_API_KEY"
    )

# ============= API Routes =============

@app.get("/")
async def root():
    """Health check"""
    return {
        "status": "healthy",
        "service": "ReadGenius API",
        "version": "0.1.0"
    }

@app.get("/api/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok"}

# ============= Dictionary Endpoints =============

@app.post("/api/dictionary", response_model=DictionaryResponse)
async def dictionary_lookup(request: DictionaryRequest):
    """
    Look up a word definition using Free Dictionary API
    """
    try:
        # Use Free Dictionary API (completely free)
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"https://api.dictionaryapi.dev/api/v2/entries/en/{request.word}"
            )
            
            if response.status_code == 200:
                data = response.json()
                if data and len(data) > 0:
                    entry = data[0]
                    first_meaning = entry.get("meanings", [{}])[0]
                    first_def = first_meaning.get("definitions", [{}])[0]
                    
                    return DictionaryResponse(
                        word=entry.get("word", request.word),
                        phonetic=entry.get("phonetic") or (entry.get("phonetics", [{}])[0] or {}).get("text"),
                        definition=first_def.get("definition", ""),
                        examples=[first_def.get("example", "")] if first_def.get("example") else [],
                        etymology=entry.get("origin"),
                        synonyms=first_meaning.get("synonyms", [])[:5],
                        antonyms=first_meaning.get("antonyms", [])[:3]
                    )
            
            # Fallback to AI if word not found
            prompt = f"""Define the word "{request.word}" in one simple sentence.
Use simple English suitable for learners.
Just return the definition, nothing else."""
            
            ai_response = await get_ai_response(prompt)
            return DictionaryResponse(
                word=request.word,
                definition=ai_response.strip(),
                examples=[]
            )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============= Explanation Endpoints =============

@app.post("/api/explain")
async def explain_text(request: ExplainRequest):
    """
    Explain a piece of text in simple terms
    """
    try:
        if request.language == "en":
            prompt = f"""Explain this text in simple, clear English:

"{request.text}"

Break it down:
1. Main idea (1 sentence)
2. Key points (2-3 bullets)
3. A simpler rephrasing

Keep it beginner-friendly but insightful. Be concise."""
        else:
            prompt = f"""请用简单的中文解释这段文字：

"{request.text}"

分解说明：
1. 主要意思（一句话）
2. 关键要点（2-3条）
3. 简化解释

保持简洁易懂。"""
        
        response_text = await get_ai_response(prompt)
        
        return {
            "explanation": response_text,
            "original_text": request.text
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============= Chat Endpoints =============

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_context(request: ChatRequest):
    """
    Chat about the content being read
    """
    try:
        prompt = f"""You are an AI reading assistant helping someone understand a book or document.

The user is currently reading this passage:
---
{request.context}
---

The user asks: "{request.question}"

Answer based on the content above. If the question isn't directly answerable from the text, acknowledge that and provide a helpful response anyway.

Keep answers clear, engaging, and appropriate for an intermediate learner. Be concise and helpful."""
        
        response_text = await get_ai_response(prompt)
        
        return ChatResponse(
            response=response_text,
            sources=[request.context[:100] + "..." if len(request.context) > 100 else request.context]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat/simple")
async def simple_chat(message: str):
    """
    Simple chat without context
    """
    try:
        prompt = f"""You are a helpful reading and learning assistant. Help the user with their question.

User's question: {message}

Provide a clear, helpful response. If they're learning English, keep explanations simple and include examples."""
        
        response_text = await get_ai_response(prompt)
        
        return {"response": response_text}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============= Utility Endpoints =============

@app.get("/api/usage")
async def get_usage_info():
    """Get API usage information"""
    return {
        "ai_provider": "ollama" if os.getenv("OLLAMA_URL") else ("groq" if GROQ_API_KEY else "none"),
        "dictionary_api": "free-dictionary-api (always free)",
        "features_available": [
            "dictionary_lookup (free)",
            "text_explanation (AI)",
            "ai_chat (AI)",
        ]
    }

# ============= Run Server =============

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)

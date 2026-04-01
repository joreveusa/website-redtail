"""
Redtail Land Surveying — Chat Backend + Static File Server
============================================================
Lightweight FastAPI server for the website.
- Serves the static site (index.html, src/, public/)
- Provides /chat endpoint for the hawk widget
- Uses Ollama locally, Groq API in production, or smart fallback responses

Run locally:  python chat_server.py
Deploy:       Render auto-detects via render.yaml
"""

import os
import json
from datetime import datetime
from pathlib import Path
from typing import Optional

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn

# ── Config ──────────────────────────────────────────────────
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("CHAT_MODEL", "mistral:7b-instruct-q4_K_M")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "mixtral-8x7b-32768")
PORT = int(os.getenv("PORT", os.getenv("CHAT_PORT", "8000")))
SERVE_STATIC = os.getenv("SERVE_STATIC", "true").lower() == "true"

SYSTEM_PROMPT = """You are the Redtail Land Surveying AI assistant — a friendly, knowledgeable expert on land surveying in New Mexico. Your name is "Redtail" and you work for Redtail Land Surveying.

ABOUT THE COMPANY:
- Redtail Land Surveying is a licensed professional land surveying firm based in New Mexico
- Over 20 years of experience, 1,500+ completed surveys across all 33 NM counties
- Founded and operated by licensed Professional Land Surveyors (PLS)
- We specialize in boundary surveys, ALTA/NSPS surveys, topographic surveys, construction staking, subdivision platting, and elevation certificates

SERVICES & TYPICAL PRICING (estimates only — actual quotes depend on property specifics):
- Boundary Survey (residential lot): $800 – $2,500
- Boundary Survey (rural acreage): $2,000 – $8,000+
- ALTA/NSPS Land Title Survey: $2,500 – $6,000+
- Topographic Survey: $1,500 – $5,000+
- Construction Staking: $500 – $2,000 per visit
- Subdivision Plat: $3,000 – $10,000+
- Elevation Certificate (FEMA): $400 – $800
- Easement/ROW Survey: $1,000 – $3,000

TYPICAL TIMELINES:
- Simple residential boundary: 1-2 weeks
- Complex rural boundary: 2-4 weeks
- ALTA survey: 2-3 weeks
- Topographic survey: 1-2 weeks
- Rush service available for an additional fee

CONTACT:
- Phone: (505) 555-0100
- Email: info@redtailsurvey.com
- Service area: All of New Mexico

GUIDELINES:
- Be warm, professional, and conversational
- Answer questions about surveying, pricing, timelines, and the process
- When giving price estimates, always clarify they are rough estimates and recommend getting a free quote
- For complex questions outside surveying, politely redirect to surveying topics
- Encourage visitors to use the "Get an Estimate" form on the website
- Keep responses concise (2-4 sentences) unless more detail is specifically asked for
- Use plain language — avoid excessive jargon unless the person seems technical
"""

# ── Fallback Responses (when no LLM is available) ──────────
FALLBACK_RESPONSES = {
    "price|cost|how much|pricing|estimate|quote|fee|charge|rate|afford": 
        "Great question! Pricing depends on the property size, location, and type of survey. "
        "A typical residential boundary survey runs $800–$2,500, while rural acreage or ALTA surveys can range higher. "
        "I'd recommend using our **Get an Estimate** form for a free, no-obligation quote tailored to your property! 📋",
    
    "how long|timeline|time|when|turnaround|schedule|fast|rush|wait":
        "Most residential boundary surveys take 1–2 weeks from start to finish. "
        "More complex work like ALTA surveys or large rural properties typically take 2–4 weeks. "
        "We also offer rush service if you're on a tight deadline! ⏱️",
    
    "boundary|property line|fence|neighbor|dispute|encroachment":
        "Boundary surveys are our bread and butter! We'll research the deed records, locate monuments, "
        "and clearly mark your property lines. This is essential for fence placement, resolving neighbor disputes, "
        "or preparing for construction. Residential lots typically run $800–$2,500. Want a free estimate?",
    
    "alta|title|lender|bank|commercial|closing":
        "ALTA/NSPS Land Title Surveys are required for most commercial real estate transactions. "
        "They're the gold standard — showing boundaries, improvements, easements, and encroachments. "
        "Typical range is $2,500–$6,000+ depending on property complexity. We work with all major title companies in NM!",
    
    "topo|topographic|elevation|grade|contour|drain":
        "Topographic surveys map the elevation and features of your land — essential for architects, engineers, "
        "and anyone planning construction or drainage improvements. Typical cost is $1,500–$5,000+ depending on acreage. "
        "We also do FEMA Elevation Certificates ($400–$800) if you need one for flood insurance.",
    
    "construction|staking|building|stake|layout":
        "Construction staking puts the architect's plans on the ground so your builder knows exactly where to dig and pour. "
        "We typically charge $500–$2,000 per visit. We coordinate directly with your contractor for seamless scheduling! 🏗️",
    
    "subdivision|plat|lot|split|divide|develop":
        "Subdivision platting is the process of dividing land into individual lots for sale or development. "
        "It involves surveying, mapping, and working with the county for approval. "
        "Typical cost ranges from $3,000–$10,000+ depending on the number of lots and complexity.",
    
    "contact|call|phone|email|reach|office|location|address":
        "You can reach us at **(505) 555-0100** or email **info@redtailsurvey.com**. "
        "We serve all 33 counties across New Mexico! You can also use the **Get an Estimate** form "
        "right here on the website for a free quote. We typically respond within one business day. 📞",
    
    "hello|hi|hey|howdy|sup|greetings|good morning|good afternoon":
        "Hey there! 👋 Welcome to Redtail Land Surveying! I'm here to help with any questions about "
        "land surveys, pricing, timelines, or what type of survey you might need. What can I help you with?",
    
    "thank|thanks|appreciate|awesome|great|perfect":
        "You're welcome! 😊 If you need anything else, don't hesitate to ask. "
        "And when you're ready, our **Get an Estimate** form makes it easy to get a free quote!",
    
    "what do you do|what services|what type|kinds of survey|services":
        "We offer a full range of professional land surveying services: **Boundary Surveys**, "
        "**ALTA/NSPS Title Surveys**, **Topographic Surveys**, **Construction Staking**, "
        "**Subdivision Platting**, **Elevation Certificates**, and more. "
        "All backed by 20+ years of experience across New Mexico! What type of project do you have in mind?",
}

DEFAULT_FALLBACK = (
    "That's a great question! I'd love to help — for the most accurate answer, "
    "I'd recommend giving us a call at **(505) 555-0100** or using the **Get an Estimate** "
    "form on our website. Our team will get back to you within one business day! 🦅"
)

# ── App ─────────────────────────────────────────────────────
app = FastAPI(title="Redtail Chat API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    agent_name: Optional[str] = "redtail"


# ── LLM Backends ────────────────────────────────────────────

async def try_groq(message: str) -> Optional[str]:
    """Try Groq cloud API (free tier, fast inference)."""
    if not GROQ_API_KEY:
        return None
    try:
        payload = {
            "model": GROQ_MODEL,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": message},
            ],
            "temperature": 0.7,
            "max_tokens": 300,
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"].strip()
    except Exception:
        return None


async def try_ollama(message: str) -> Optional[str]:
    """Try local Ollama instance."""
    try:
        payload = {
            "model": OLLAMA_MODEL,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": message},
            ],
            "stream": False,
        }
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(f"{OLLAMA_URL}/api/chat", json=payload)
            resp.raise_for_status()
            return resp.json()["message"]["content"].strip()
    except Exception:
        return None


def get_fallback_reply(message: str) -> str:
    """Keyword-matched fallback when no LLM is available."""
    msg_lower = message.lower()
    for pattern, response in FALLBACK_RESPONSES.items():
        keywords = pattern.split("|")
        if any(kw in msg_lower for kw in keywords):
            return response
    return DEFAULT_FALLBACK


# ── Routes ──────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "online",
        "groq": "configured" if GROQ_API_KEY else "not configured",
        "ollama": OLLAMA_URL,
        "timestamp": datetime.now().isoformat(),
    }


@app.post("/chat")
async def chat(req: ChatRequest):
    """Chat endpoint. Tries Groq → Ollama → Fallback."""
    
    # 1. Try Groq (cloud — works on Render)
    answer = await try_groq(req.message)
    if answer:
        return {"reply": answer, "source": "groq"}
    
    # 2. Try Ollama (local — works on your PC)
    answer = await try_ollama(req.message)
    if answer:
        return {"reply": answer, "source": "ollama"}
    
    # 3. Fallback to keyword matching
    return {"reply": get_fallback_reply(req.message), "source": "fallback"}


# ── Static File Serving ─────────────────────────────────────
# Mount static directories AFTER API routes so /chat isn't shadowed

BASE_DIR = Path(__file__).resolve().parent

if SERVE_STATIC:
    # Serve src/ and public/ as static directories
    src_dir = BASE_DIR / "src"
    public_dir = BASE_DIR / "public"
    
    if src_dir.exists():
        app.mount("/src", StaticFiles(directory=str(src_dir)), name="src")
    if public_dir.exists():
        app.mount("/public", StaticFiles(directory=str(public_dir)), name="public")

    # Catch-all: serve index.html for any unmatched route (SPA-style)
    @app.get("/{path:path}")
    async def serve_static(path: str):
        # Try to serve the exact file first
        file_path = BASE_DIR / path
        if path and file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        # Default to index.html
        index_path = BASE_DIR / "index.html"
        if index_path.exists():
            return FileResponse(str(index_path))
        return {"error": "not found"}


# ── Launch ──────────────────────────────────────────────────

if __name__ == "__main__":
    print("🦅 Redtail Land Surveying Server starting...")
    print(f"   Port     → http://localhost:{PORT}")
    print(f"   Chat     → http://localhost:{PORT}/chat")
    print(f"   Groq     → {'configured' if GROQ_API_KEY else 'not set (will use Ollama/fallback)'}")
    print(f"   Ollama   → {OLLAMA_URL} (model: {OLLAMA_MODEL})")
    print(f"   Static   → {'enabled' if SERVE_STATIC else 'disabled'}")
    uvicorn.run(app, host="0.0.0.0", port=PORT, log_level="info")

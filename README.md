# debugor-ai - AI Socratic Debugging Tutor

A full-stack AI-powered debugging tutor that uses the Socratic method to guide users toward self-discovering code bugs. Built as a portfolio project to demonstrate AI engineering expertise, including LLM integration (Ollama/OpenRouter), prompt engineering for educational guidance, hybrid symbolic-neural reasoning (AST parsing + LLM), and responsive UI.

## Features
**Socratic Tutoring**: LLM prompts designed to ask guiding questions instead of direct fixes, fostering learning.
**AST-Based Grounding**: Extracts code facts (variables, functions) via Python's ast module for accurate, context-aware responses.
**Dual LLM Backends**: Supports local Ollama (e.g., Llama 3.2) for privacy/offline use and cloud-based OpenRouter (e.g., GPT-4o/Claude) for advanced models.
**Interactive Chat UI**: Real-time conversation history, code editor (Monaco), and session management (end/reset).
**Multi-Language Support**: Focused on Python with AST, extensible to JS/Java/etc.
**Portfolio Highlights**: Demonstrates full-stack AI (FastAPI backend, React/Vite/Tailwind frontend), error handling, CORS, and deployment readiness.

## Tech Stack
**Backend**: FastAPI (API), Ollama/OpenAI clients (LLM), Python AST (grounding), Pydantic (validation).
**Frontend**: React (UI), Vite (build), Tailwind CSS (styling), Monaco Editor (code highlighting), Axios (API calls).
**AI Aspects**: Prompt engineering for Socratic dialogue, conversation state management, hybrid AI (symbolic AST + generative LLM).
**Tools/Deps**: Updated to 2026 standards (e.g., FastAPI 0.129, React 19, Tailwind v4).

## Setup & Running Locally
### Prerequisites
Python 3.12+
Node.js 20+
Ollama (for local LLM: install from ollama.com, pull a model like ollama pull llama3.1)
OpenRouter API key (optional, for cloud: sign up at openrouter.ai)

### Backend
1. Navigate: cd backend
2. Create venv: python -m venv env && source env/bin/activate (Unix) or env\Scripts\activate (Windows)
3. Install deps: pip install -r requirements.txt
4. Set env: Create .env with OPENROUTER_API_KEY=your_key and OLLAMA_MODEL=llama3.2
5. Run: uvicorn main:app --reload --port 8000

### Frontend
1. Navigate: cd frontend
2. Install deps: npm install
3. Run: npm run dev (opens at http://localhost:5173)

Test: Submit buggy code + issue; interact via chat. Use "End Session" to reset.

## Deployment (for Production/Portfolio Demo)
**Backend**: Deploy to Render/Heroku/Fly.io (free tiers). Set env vars for API keys.
**Frontend**: Deploy to Vercel/Netlify. Update API URL in App.jsx (e.g., via import.meta.env.VITE_API_URL).

## Why This Project?
As an AI engineer, I built this to showcase:
**LLM Orchestration**: Seamless switching between local/cloud models with error-resilient prompts.
**Hybrid AI**: Combining symbolic (AST) and neural (LLM) for grounded, accurate tutoring.
**Ethical AI Design**: Socratic method promotes user learning over spoon-feeding.
**Full-Stack Skills**: API design, stateful chat, responsive UI.
**Security/Best Practices**: CORS, input validation, no hardcoded keys.

Improvements in progress: Multi-turn memory enhancements, JS AST support, user auth.

## Contact
Elham Fo - elham.fo@gmail.com

Open to contributions or discussions on AI engineering!
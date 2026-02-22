# debugor-ai – AI Socratic Debugging Tutor

A full-stack **AI-powered debugging tutor** that uses the **Socratic method** to guide users toward self-discovering and understanding code bugs — without giving direct fixes.

## Features

- **Socratic Tutoring**  
  Carefully engineered LLM prompts that ask guiding questions to help users reason through bugs themselves

- **AST-Based Code Grounding**  
  Uses Python's `ast` module to extract variables, functions, and structure for context-aware, accurate guidance

- **Dual LLM Backends**  
  - Local: Ollama (e.g., Llama 3.2) – privacy-focused, offline-capable  
  - Cloud: OpenRouter (e.g., GPT-4o, Claude 3.5) – powerful, fast models

- **Interactive Chat UI**  
  Real-time conversation history, Monaco code editor, session management (start/end/reset)

- **Multi-Language Support**  
  Core support for Python (with AST grounding), easily extensible to JavaScript, Java, etc.

- **Portfolio Highlights**  
  Demonstrates FastAPI backend, React/Vite/Tailwind frontend, CORS handling, error resilience, and dual deployment (Railway + Netlify)

## Tech Stack

- **Backend**  
  - FastAPI (API framework)  
  - Ollama & OpenAI-compatible client (LLM integration)  
  - Python `ast` module (code analysis & grounding)  
  - Pydantic (data validation & settings)

- **Frontend**  
  - React (UI & state management)  
  - Vite (fast build tool)  
  - Tailwind CSS (styling)  
  - Monaco Editor (code highlighting & editing)  
  - Axios (API communication)

- **AI & Core Concepts**  
  - Advanced prompt engineering (Socratic dialogue)  
  - Conversation state management  
  - Hybrid AI: symbolic (AST parsing) + generative (LLM)

- **Tools & Standards**  
  Updated to 2026 best practices (FastAPI 0.115+, React 19, Tailwind v4, Python 3.12+)

## Live Demo

- **Frontend (interactive tutor)**: https://debugor-ai.netlify.app  
- **Backend API Docs (Swagger)**: https://debugor-ai-production.up.railway.app/docs

> Note: Local Ollama mode is available in development only. The live demo uses OpenRouter for reliable performance.

## Quick Start (Local Development)

### Prerequisites

- Python 3.12+
- Node.js 20+
- Ollama (optional – for local LLM: install from ollama.com, run `ollama pull llama3.2`)
- OpenRouter API key (optional – sign up at openrouter.ai)

### Clone & Setup

git clone https://github.com/elhamfo/debugor-ai.git
cd debugor-ai

#### Backend

1. Navigate: `cd backend`
2. Create virtual environment:  
   `python -m venv env`  
   then activate it:  
   - Unix/macOS: `source env/bin/activate`  
   - Windows: `env\Scripts\activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Set environment variables:  
   Create a `.env` file in the `backend` folder with: OPENROUTER_API_KEY=your_openrouter_key_here

5. Run the server:  
`uvicorn app:app --reload --port 8000`

#### Frontend

1. Navigate: `cd ../frontend` (or open a new terminal in the `frontend` folder)
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`  
→ Opens at http://localhost:5173

**Test the app locally:**  
- Open http://localhost:5173 in your browser  
- Enter buggy code and describe the issue  
- Interact with the Socratic tutor  
- Use the "End Session" button to reset and start over

### Deployment

- **Backend**: Deployed on Railway (free tier)  
Live API: https://debugor-ai-production.up.railway.app  
Interactive docs: https://debugor-ai-production.up.railway.app/docs

- **Frontend**: Deployed on Netlify  
Live demo: https://debugor-ai.netlify.app

Both services auto-deploy on every push to the `main` branch. Environment variables (API keys, backend URL) are managed securely via each platform's dashboard.

### Live Demo

-  **Interactive Tutor (Frontend)**: https://debugor-ai.netlify.app  
-  **API Documentation (Swagger)**: https://debugor-ai-production.up.railway.app/docs

> Note: The live demo uses **OpenRouter** for reliable performance.  
> Local Ollama mode is only available when running locally.

### Why This Project?

As an AI engineer, I created this project to demonstrate:

- **LLM Orchestration**  
Seamless switching between local (Ollama) and cloud (OpenRouter) models with robust error handling

- **Hybrid AI Reasoning**  
Combining symbolic code analysis (AST parsing) with generative LLM capabilities for accurate, context-aware tutoring

- **Ethical & Educational AI**  
Socratic prompting prioritizes user learning and understanding over simply providing answers

- **Full-Stack Production Skills**  
Clean API design, stateful chat UI, CORS configuration, environment management, and dual-platform deployment

- **Security & Best Practices**  
Input validation, no hardcoded secrets, proper CORS, and deployment on free-tier cloud platforms

### Improvements in Progress

- Persistent conversation history (multi-turn memory)  
- JavaScript and other language AST support  
- User authentication and saved sessions  
- Tutor effectiveness metrics and evaluation

### Contact

**Elham Fo**  
📧 elham.fo@gmail.com  

Open to contributions, feedback, collaborations, and discussions about applied AI engineering, educational AI, LLM applications, and full-stack ML systems!

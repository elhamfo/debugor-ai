import os
import ast
from typing import List, Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import ollama
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Socratic AI Debugging Tutor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")  # or "llama3", "mistral", etc.

if not OPENROUTER_API_KEY and os.getenv("OLLAMA_MODEL"):
    print("Warning: OPENROUTER_API_KEY not set – OpenRouter mode will fail")

class DebugRequest(BaseModel):
    code: str
    language: str
    issue_description: str = ""
    llm_provider: str              # "ollama" or "openrouter"
    model: str | None = None
    conversation_history: List[Dict[str, str]] = []

def get_ast_grounding(code: str) -> str:
    if not code.strip():
        return "No code provided."
    try:
        tree = ast.parse(code)
        names_defined = set()
        functions_defined = set()
        classes_defined = set()

        for node in ast.walk(tree):
            if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
                names_defined.add(node.id)
            elif isinstance(node, ast.FunctionDef):
                functions_defined.add(node.name)
            elif isinstance(node, ast.ClassDef):
                classes_defined.add(node.name)

        grounding = []
        if names_defined:
            grounding.append(f"Defined variables/constants: {', '.join(sorted(names_defined))}")
        if functions_defined:
            grounding.append(f"Defined functions: {', '.join(sorted(functions_defined))}")
        if classes_defined:
            grounding.append(f"Defined classes: {', '.join(sorted(classes_defined))}")

        return "\n".join(grounding) or "No variable/function/class definitions detected."
    except SyntaxError as e:
        return f"Syntax error in code: {str(e)} (line {e.lineno or '?'})"
    except Exception as e:
        return f"Could not analyze code structure: {str(e)}"

@app.post("/debug")
async def debug_code(req: DebugRequest):
    if not req.code.strip():
        raise HTTPException(400, "No code provided")

    grounding = get_ast_grounding(req.code)

    # Build conversation messages
    messages = [
        {"role": "system", "content": """You are a patient, Socratic debugging tutor.
    Your goal is to HELP THE USER DISCOVER the bug themselves through questions, hints, and reasoning prompts.
    NEVER give the corrected code or directly say what the bug is.
    Use questions like:
    What do you think this line is supposed to do?
    Have you checked whether ... is defined before it's used?
    What happens if you print ... right before the error line?
    Can you describe the difference between what you expect and what actually happens?

    Be encouraging. Ask one or two focused questions at a time.
    If they are stuck, give a small hint — but still no direct solution."""}
    ]

    # Add conversation history
    messages.extend(req.conversation_history)

    # Add current user message / grounding
    current_prompt = f"""Grounding from code analysis (AST):
    {grounding}

    Language: {req.language}
    Code:
    {req.language}

    {req.code}
    """
    if req.issue_description: 
        current_prompt += f"Initial problem description: {req.issue_description}\n\n"
        current_prompt += "Continue the Socratic dialogue based on the latest user message."

    messages.append({"role": "user", "content": current_prompt})

    try:
        if req.llm_provider == "openrouter":
            if not OPENROUTER_API_KEY:
                raise HTTPException(500, "OpenRouter API key not configured")
            client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=OPENROUTER_API_KEY,
            )
            response = client.chat.completions.create(
                model=req.model or "openai/gpt-4o",
                messages=messages,
                temperature=0.7,
                max_tokens=1200,
            )
            answer = response.choices[0].message.content.strip()

        elif req.llm_provider == "ollama":
            response = ollama.chat(
                model=OLLAMA_MODEL,
                messages=messages,
                options={"temperature": 0.7, "num_predict": 1200}
            )
            answer = response['message']['content'].strip()

        else:
            raise HTTPException(400, "Invalid llm_provider. Use 'ollama' or 'openrouter'")

        return {"response": answer}

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(500, f"LLM backend error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True,)

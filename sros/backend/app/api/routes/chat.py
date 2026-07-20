from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(prefix="/chat", tags=["chat"])


class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None


class ChatResponse(BaseModel):
    response: str
    session_id: str
    history: List[Message]


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """Send a query to the chat assistant."""
    session_id = request.session_id or "session-placeholder-123"
    return {
        "response": f"This is a mock assistant response to: '{request.message}'",
        "session_id": session_id,
        "history": [
            {"role": "user", "content": request.message},
            {"role": "assistant", "content": f"This is a mock assistant response to: '{request.message}'"}
        ]
    }


@router.get("/sessions", response_model=List[Dict[str, Any]])
async def list_sessions():
    """List all chat sessions."""
    return [
        {
            "session_id": "session-placeholder-123",
            "title": "Document QA Discussion",
            "created_at": "2026-07-20T14:00:00Z"
        }
    ]

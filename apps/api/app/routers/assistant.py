from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session

from ..database import get_session
from ..security import get_current_user
from ..models import User
from ..assistant import chat, check_rate_limit

router = APIRouter(prefix="/assistant", tags=["assistant"])


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(
    data: ChatRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if not check_rate_limit(current_user.id):
        raise HTTPException(status_code=429, detail="Hai raggiunto il limite di messaggi orari. Riprova più tardi.")
    reply = chat(session, current_user, data.message)
    return ChatResponse(reply=reply)
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session

from ..database import get_session
from ..security import get_current_user
from ..models import User
from ..assistant import chat

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
    reply = chat(session, current_user, data.message)
    return ChatResponse(reply=reply)
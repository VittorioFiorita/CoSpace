from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..database import get_session
from ..models import Space, User
from ..schemas import SpaceCreate, SpaceRead
from ..security import get_current_user, require_staff

router = APIRouter(prefix="/spaces", tags=["spaces"])

@router.get("/", response_model=list[SpaceRead])
def list_spaces(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    return session.exec(select(Space)).all()

@router.get("/{space_id}", response_model=SpaceRead)
def get_space(space_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    space = session.get(Space, space_id)
    if not space:
        raise HTTPException(status_code=404, detail="Spazio non trovato")
    return space

@router.post("/", response_model=SpaceRead)
def create_space(data: SpaceCreate, session: Session = Depends(get_session), current_user: User = Depends(require_staff)):
    space = Space(name=data.name, space_type=data.space_type, capacity=data.capacity)
    session.add(space)
    session.commit()
    session.refresh(space)
    return space

@router.delete("/{space_id}", status_code=204)
def delete_space(space_id: int, session: Session = Depends(get_session), current_user: User = Depends(require_staff)):
    space = session.get(Space, space_id)
    if not space:
        raise HTTPException(status_code=404, detail="Spazio non trovato")
    session.delete(space)
    session.commit()
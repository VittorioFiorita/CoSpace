from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..database import get_session
from ..models import User
from ..schemas import UserRead, UserRoleUpdate
from ..security import require_admin

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=list[UserRead])
def list_users(session: Session = Depends(get_session), current_user: User = Depends(require_admin)):
    return session.exec(select(User)).all()

@router.patch("/{user_id}/role", response_model=UserRead)
def update_user_role(
    user_id: int,
    data: UserRoleUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin)
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    user.role = data.role
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
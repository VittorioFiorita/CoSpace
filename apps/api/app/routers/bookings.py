from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..database import get_session
from ..models import Booking, User
from ..schemas import BookingCreate, BookingRead
from ..security import get_current_user, require_staff
from ..booking_service import create_booking_for_user

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.post("/", response_model=BookingRead)
def create_booking(data: BookingCreate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    try:
        return create_booking_for_user(session, current_user.id, data.space_id, data.start_time, data.end_time)
    except ValueError as e:
        detail = str(e)
        if "già prenotato" in detail:
            status_code = 409
        elif "non trovato" in detail:
            status_code = 404
        else:
            status_code = 400
        raise HTTPException(status_code=status_code, detail=detail)

@router.get("/me", response_model=list[BookingRead])
def list_my_bookings(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    return session.exec(select(Booking).where(Booking.user_id == current_user.id)).all()

@router.delete("/{booking_id}", status_code=204)
def cancel_booking(booking_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    booking = session.get(Booking, booking_id)
    if not booking or booking.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Prenotazione non trovata")
    booking.status = "cancelled"
    session.add(booking)
    session.commit()

@router.get("/", response_model=list[BookingRead])
def list_all_bookings(session: Session = Depends(get_session), current_user: User = Depends(require_staff)):
    return session.exec(select(Booking)).all()
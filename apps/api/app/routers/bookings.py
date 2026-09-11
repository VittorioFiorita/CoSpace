from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..database import get_session
from ..models import Booking, Space, User
from ..schemas import BookingCreate, BookingRead
from ..security import get_current_user, require_staff

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.post("/", response_model=BookingRead)
def create_booking(data: BookingCreate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    if data.start_time >= data.end_time:
        raise HTTPException(status_code=400, detail="l'orario d'inizio deve essere precedente a quello di fine")

    space=session.get(Space, data.space_id)
    if not space:
        raise HTTPException(status_code=404, detail="Spazio non trovato")

    overlapping = session.exec(select(Booking).where(Booking.space_id == data.space_id, Booking.status == "confirmed", Booking.start_time < data.end_time, Booking.end_time > data.start_time)).first()
    if overlapping:
        raise HTTPException(status_code=409, detail="Spazio già prenotato per questo time slot")

    booking = Booking(space_id=data.space_id, user_id=current_user.id, start_time=data.start_time, end_time=data.end_time)
    session.add(booking)
    session.commit()
    session.refresh(booking)
    return booking

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
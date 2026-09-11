from sqlmodel import Session, select

from .models import Booking, Space


def create_booking_for_user(session: Session, user_id: int, space_id: int, start_time, end_time) -> Booking:
    if start_time >= end_time:
        raise ValueError("l'orario d'inizio deve essere precedente a quello di fine")

    space = session.get(Space, space_id)
    if not space:
        raise ValueError("Spazio non trovato")

    overlapping = session.exec(
        select(Booking).where(
            Booking.space_id == space_id,
            Booking.status == "confirmed",
            Booking.start_time < end_time,
            Booking.end_time > start_time,
        )
    ).first()
    if overlapping:
        raise ValueError("Spazio già prenotato per questo time slot")

    booking = Booking(space_id=space_id, user_id=user_id, start_time=start_time, end_time=end_time)
    session.add(booking)
    session.commit()
    session.refresh(booking)
    return booking
import pytest
from datetime import datetime

from sqlmodel import Session, SQLModel, create_engine

from app.models import User, Space, Booking
from app.booking_service import create_booking_for_user


@pytest.fixture
def session():
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine, tables=[User.__table__, Space.__table__, Booking.__table__])
    with Session(engine) as session:
        yield session


@pytest.fixture
def user(session):
    user = User(email="test@example.com", hashed_password="x", full_name="Test User")
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture
def space(session):
    space = Space(name="Sala Test", space_type="meeting_room", capacity=4)
    session.add(space)
    session.commit()
    session.refresh(space)
    return space


def test_create_booking_success(session, user, space):
    start = datetime(2026, 9, 15, 10, 0)
    end = datetime(2026, 9, 15, 11, 0)
    booking = create_booking_for_user(session, user.id, space.id, start, end)
    assert booking.id is not None
    assert booking.status == "confirmed"


def test_create_booking_start_after_end_raises(session, user, space):
    start = datetime(2026, 9, 15, 11, 0)
    end = datetime(2026, 9, 15, 10, 0)
    with pytest.raises(ValueError, match="precedente"):
        create_booking_for_user(session, user.id, space.id, start, end)


def test_create_booking_nonexistent_space_raises(session, user):
    start = datetime(2026, 9, 15, 10, 0)
    end = datetime(2026, 9, 15, 11, 0)
    with pytest.raises(ValueError, match="non trovato"):
        create_booking_for_user(session, user.id, 999, start, end)


def test_create_booking_overlap_raises(session, user, space):
    create_booking_for_user(session, user.id, space.id, datetime(2026, 9, 15, 10, 0), datetime(2026, 9, 15, 11, 0))
    with pytest.raises(ValueError, match="già prenotato"):
        create_booking_for_user(
            session, user.id, space.id, datetime(2026, 9, 15, 10, 30), datetime(2026, 9, 15, 11, 30)
        )


def test_create_booking_no_overlap_after_cancelled(session, user, space):
    first = create_booking_for_user(session, user.id, space.id, datetime(2026, 9, 15, 10, 0), datetime(2026, 9, 15, 11, 0))
    first.status = "cancelled"
    session.add(first)
    session.commit()

    second = create_booking_for_user(session, user.id, space.id, datetime(2026, 9, 15, 10, 0), datetime(2026, 9, 15, 11, 0))
    assert second.id is not None
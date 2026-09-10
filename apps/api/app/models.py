from datetime import datetime
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: str
    role: str = Field(default="member")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Space(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    space_type: str
    capacity: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Booking(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    space_id: int = Field(foreign_key="space.id")
    user_id: int = Field(foreign_key="user.id")
    start_time: datetime
    end_time: datetime
    status: str = Field(default="confirmed")
    created_at: datetime = Field(default_factory=datetime.utcnow)
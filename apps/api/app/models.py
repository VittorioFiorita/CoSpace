from datetime import datetime, UTC
from sqlmodel import SQLModel, Field
from pgvector.sqlalchemy import Vector
from sqlalchemy import Column

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: str
    role: str = Field(default="member")
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

class Space(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    space_type: str
    capacity: int
    opening_time: str | None = None
    closing_time: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

class Booking(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    space_id: int = Field(foreign_key="space.id")
    user_id: int = Field(foreign_key="user.id")
    start_time: datetime
    end_time: datetime
    status: str = Field(default="confirmed")
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

class KnowledgeChunk(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    content: str
    embedding: list[float] = Field(sa_column=Column(Vector(384)))
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Literal

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str

class UserRead(BaseModel):
    id: int
    email: str
    full_name: str
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class SpaceCreate(BaseModel):
    name: str
    space_type: str
    capacity: int
    opening_time: str | None = None
    closing_time: str | None = None

class SpaceRead(BaseModel):
    id: int
    name: str
    space_type: str
    capacity: int
    opening_time: str | None = None
    closing_time: str | None = None

class BookingCreate(BaseModel):
    space_id: int
    start_time: datetime
    end_time: datetime

class BookingRead(BaseModel):
    id: int
    space_id: int
    user_id: int
    start_time: datetime
    end_time: datetime
    status: str

class UserRoleUpdate(BaseModel):
    role: Literal["member", "staff", "admin"]
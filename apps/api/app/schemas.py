from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    password: str
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

class SpaceRead(BaseModel):
    id: int
    name:str
    space_type: str
    capacity: int

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
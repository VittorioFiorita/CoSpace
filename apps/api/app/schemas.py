from pydantic import BaseModel

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
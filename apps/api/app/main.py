from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import auth, spaces, bookings, assistant, users

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(spaces.router)
app.include_router(bookings.router)
app.include_router(assistant.router)
app.include_router(users.router)

@app.get("/health")
def health():
    return{"status": "ok"}
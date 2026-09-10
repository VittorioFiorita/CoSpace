from fastapi import FastAPI

from .routers import auth, spaces, bookings

app = FastAPI()

app.include_router(auth.router)
app.include_router(spaces.router)
app.include_router(bookings.router)

@app.get("/health")
def health():
    return{"status": "ok"}
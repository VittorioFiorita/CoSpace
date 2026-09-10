from fastapi import FastAPI

from .routers import auth, spaces

app = FastAPI()

app.include_router(auth.router)
app.include_router(spaces.router)

@app.get("/health")
def health():
    return{"status": "ok"}
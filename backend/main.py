import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import action_items, meetings, participants, transcripts


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Fireflies Meeting Workspace API",
    description="Backend API for the Fireflies-inspired meeting notes platform.",
    version="1.0.0",
)


frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000",
)


allowed_origins = [
    origin.strip()
    for origin in frontend_url.split(",")
    if origin.strip()
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(meetings.router)
app.include_router(transcripts.router)
app.include_router(action_items.router)
app.include_router(participants.router)


@app.get("/")
def root():
    return {
        "message": "Fireflies Meeting Workspace API",
        "status": "running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }
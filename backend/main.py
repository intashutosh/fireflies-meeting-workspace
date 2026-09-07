from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine

import models

from routers import meetings
from routers import transcripts
from routers import action_items


app = FastAPI(
    title="Fireflies Meeting Workspace API",
    description="Backend API for the Fireflies-inspired meeting workspace.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


app.include_router(meetings.router)
app.include_router(transcripts.router)
app.include_router(action_items.router)


@app.get("/")
def root():
    return {
        "message": "Fireflies Meeting Workspace API",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }
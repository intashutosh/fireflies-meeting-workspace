from fastapi import APIRouter

router = APIRouter(
    prefix="/api/meetings",
    tags=["Meetings"],
)
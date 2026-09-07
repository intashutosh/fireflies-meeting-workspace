from fastapi import APIRouter

router = APIRouter(
    prefix="/api/action-items",
    tags=["Action Items"],
)
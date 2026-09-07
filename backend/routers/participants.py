from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Participant
from schemas import ParticipantResponse

router = APIRouter(
    prefix="/api/participants",
    tags=["Participants"],
)


@router.get(
    "",
    response_model=list[ParticipantResponse],
)
def get_participants(
    db: Session = Depends(get_db),
):
    return (
        db.query(Participant)
        .order_by(Participant.name.asc())
        .all()
    )

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload

from database import get_db
# 1. Import models directly to reference class attributes
from models import ActionItem, Meeting, TranscriptSegment
from schemas import (
    MeetingCreate,
    MeetingListResponse,
    MeetingResponse,
    MeetingUpdate,
)

router = APIRouter(
    prefix="/api/meetings",
    tags=["Meetings"],
)


@router.get(
    "",
    response_model=list[MeetingListResponse],
)
def get_meetings(
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Meeting)
        .options(selectinload(Meeting.participants))
        .order_by(Meeting.date.desc())
    )

    if search:
        query = query.filter(
            Meeting.title.ilike(f"%{search}%")
        )

    return query.all()


@router.get(
    "/{meeting_id}",
    response_model=MeetingResponse,
)
def get_meeting(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    # 2. Fixed string loader options to use class-bound attributes
    meeting = (
        db.query(Meeting)
        .options(
            selectinload(Meeting.participants),
            selectinload(Meeting.transcript_segments).selectinload(
                TranscriptSegment.speaker
            ),
            selectinload(Meeting.action_items).selectinload(
                ActionItem.assignee
            ),
            selectinload(Meeting.topics),
        )
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found",
        )

    return meeting


@router.post(
    "",
    response_model=MeetingResponse,
    status_code=201,
)
def create_meeting(
    meeting_data: MeetingCreate,
    db: Session = Depends(get_db),
):
    meeting = Meeting(
        title=meeting_data.title,
        date=meeting_data.date,
        duration_seconds=meeting_data.duration_seconds,
        summary=meeting_data.summary,
    )

    db.add(meeting)
    db.commit()
    db.refresh(meeting)

    return meeting


@router.patch(
    "/{meeting_id}",
    response_model=MeetingResponse,
)
def update_meeting(
    meeting_id: int,
    meeting_data: MeetingUpdate,
    db: Session = Depends(get_db),
):
    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found",
        )

    update_data = meeting_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(meeting, field, value)

    db.commit()
    db.refresh(meeting)

    return meeting


@router.delete(
    "/{meeting_id}",
    status_code=204,
)
def delete_meeting(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found",
        )

    db.delete(meeting)
    db.commit()

    return None
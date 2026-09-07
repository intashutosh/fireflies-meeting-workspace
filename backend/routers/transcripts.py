from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from database import get_db
from models import Meeting, TranscriptSegment
from schemas import (
    TranscriptSegmentCreate,
    TranscriptSegmentResponse,
)


router = APIRouter(
    prefix="/api/transcripts",
    tags=["Transcripts"],
)


@router.get(
    "/meeting/{meeting_id}",
    response_model=list[TranscriptSegmentResponse],
)
def get_transcript(
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

    segments = (
        db.query(TranscriptSegment)
        .options(
            selectinload(TranscriptSegment.speaker)
        )
        .filter(
            TranscriptSegment.meeting_id == meeting_id
        )
        .order_by(TranscriptSegment.sequence)
        .all()
    )

    return segments


@router.post(
    "/meeting/{meeting_id}",
    response_model=TranscriptSegmentResponse,
    status_code=201,
)
def create_transcript_segment(
    meeting_id: int,
    segment_data: TranscriptSegmentCreate,
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

    segment = TranscriptSegment(
        meeting_id=meeting_id,
        speaker_id=segment_data.speaker_id,
        start_time=segment_data.start_time,
        end_time=segment_data.end_time,
        text=segment_data.text,
        sequence=segment_data.sequence,
    )

    db.add(segment)
    db.commit()
    db.refresh(segment)

    return segment
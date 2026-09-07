from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from database import get_db
from models import Meeting, Participant, TranscriptSegment
from schemas import (
    TranscriptSegmentCreate,
    TranscriptSegmentResponse,
)
from services.transcript_parser import parse_transcript


router = APIRouter(
    prefix="/api/transcripts",
    tags=["Transcripts"],
)


class TranscriptImportRequest(BaseModel):
    transcript: str = Field(
        min_length=1,
        max_length=100000,
    )


@router.post("/meeting/{meeting_id}/import")
def import_transcript(
    meeting_id: int,
    payload: TranscriptImportRequest,
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

    parsed_segments = parse_transcript(
        payload.transcript
    )

    if not parsed_segments:
        raise HTTPException(
            status_code=400,
            detail=(
                "Could not parse transcript. "
                "Use the format 'Speaker: text'."
            ),
        )

    try:
        # Import represents the current transcript,
        # so replace any previous imported segments.
        db.query(TranscriptSegment).filter(
            TranscriptSegment.meeting_id == meeting_id
        ).delete(
            synchronize_session=False
        )

        speaker_cache: dict[str, Participant] = {}

        for segment in parsed_segments:
            speaker_name = segment["speaker_name"]

            if speaker_name not in speaker_cache:
                participant = (
                    db.query(Participant)
                    .filter(
                        Participant.name == speaker_name
                    )
                    .first()
                )

                if not participant:
                    participant = Participant(
                        name=speaker_name
                    )

                    db.add(participant)
                    db.flush()

                speaker_cache[speaker_name] = participant

                if participant not in meeting.participants:
                    meeting.participants.append(
                        participant
                    )

            participant = speaker_cache[speaker_name]

            start_time = segment["sequence"] * 10
            end_time = start_time + 10

            transcript_segment = TranscriptSegment(
                meeting_id=meeting.id,
                speaker_id=participant.id,
                start_time=start_time,
                end_time=end_time,
                text=segment["text"],
                sequence=segment["sequence"],
            )

            db.add(transcript_segment)

        db.commit()

    except Exception:
        db.rollback()
        raise

    return {
        "message": "Transcript imported successfully",
        "segments_created": len(parsed_segments),
    }


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

    if segment_data.end_time < segment_data.start_time:
        raise HTTPException(
            status_code=400,
            detail="End time cannot be before start time",
        )

    try:
        segment = TranscriptSegment(
            meeting_id=meeting_id,
            speaker_id=segment_data.speaker_id,
            start_time=segment_data.start_time,
            end_time=segment_data.end_time,
            text=segment_data.text.strip(),
            sequence=segment_data.sequence,
        )

        db.add(segment)
        db.commit()
        db.refresh(segment)

        return segment

    except Exception:
        db.rollback()
        raise
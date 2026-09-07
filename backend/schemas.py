from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ParticipantBase(BaseModel):
    name: str
    email: str | None = None
    avatar: str | None = None


class ParticipantResponse(ParticipantBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class TranscriptSegmentResponse(BaseModel):
    id: int
    speaker_id: int
    speaker: ParticipantResponse
    start_time: float
    end_time: float
    text: str
    sequence: int

    model_config = ConfigDict(from_attributes=True)


class ActionItemResponse(BaseModel):
    id: int
    meeting_id: int
    assignee_id: int | None
    assignee: ParticipantResponse | None
    title: str
    description: str | None
    due_date: datetime | None
    completed: bool

    model_config = ConfigDict(from_attributes=True)


class TopicResponse(BaseModel):
    id: int
    title: str
    description: str | None
    timestamp: float | None

    model_config = ConfigDict(from_attributes=True)


class MeetingResponse(BaseModel):
    id: int
    title: str
    date: datetime
    duration_seconds: int
    summary: str | None

    participants: list[ParticipantResponse]
    transcript_segments: list[TranscriptSegmentResponse]
    action_items: list[ActionItemResponse]
    topics: list[TopicResponse]

    model_config = ConfigDict(from_attributes=True)


class MeetingListResponse(BaseModel):
    id: int
    title: str
    date: datetime
    duration_seconds: int
    summary: str | None
    participants: list[ParticipantResponse]

    model_config = ConfigDict(from_attributes=True)
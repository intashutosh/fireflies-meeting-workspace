from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ParticipantBase(BaseModel):
    name: str
    email: str | None = None
    avatar: str | None = None


class ParticipantResponse(ParticipantBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )


class TranscriptSegmentBase(BaseModel):
    speaker_id: int
    start_time: float
    end_time: float
    text: str
    sequence: int


class TranscriptSegmentCreate(TranscriptSegmentBase):
    pass


class TranscriptSegmentResponse(TranscriptSegmentBase):
    id: int
    speaker: ParticipantResponse

    model_config = ConfigDict(
        from_attributes=True
    )


class ActionItemCreate(BaseModel):
    title: str
    description: str | None = None
    assignee_id: int | None = None
    due_date: datetime | None = None


class ActionItemUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    assignee_id: int | None = None
    due_date: datetime | None = None
    completed: bool | None = None


class ActionItemResponse(BaseModel):
    id: int
    meeting_id: int
    assignee_id: int | None
    assignee: ParticipantResponse | None
    title: str
    description: str | None
    due_date: datetime | None
    completed: bool

    model_config = ConfigDict(
        from_attributes=True
    )


class TopicResponse(BaseModel):
    id: int
    title: str
    description: str | None
    timestamp: float | None

    model_config = ConfigDict(
        from_attributes=True
    )


class MeetingCreate(BaseModel):
    title: str
    date: datetime
    duration_seconds: int
    summary: str | None = None


class MeetingUpdate(BaseModel):
    title: str | None = None
    date: datetime | None = None
    duration_seconds: int | None = None
    summary: str | None = None


class MeetingListResponse(BaseModel):
    id: int
    title: str
    date: datetime
    duration_seconds: int
    summary: str | None
    participants: list[ParticipantResponse]

    model_config = ConfigDict(
        from_attributes=True
    )


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

    model_config = ConfigDict(
        from_attributes=True
    )
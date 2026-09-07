from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ParticipantBase(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    email: str | None = Field(default=None, max_length=255)
    avatar: str | None = Field(default=None, max_length=500)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Participant name cannot be empty")

        return value


class ParticipantResponse(ParticipantBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class TranscriptSegmentBase(BaseModel):
    speaker_id: int
    start_time: float = Field(ge=0)
    end_time: float = Field(ge=0)
    text: str = Field(min_length=1)
    sequence: int = Field(ge=0)

    @field_validator("text")
    @classmethod
    def validate_text(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Transcript text cannot be empty")

        return value


class TranscriptSegmentCreate(TranscriptSegmentBase):
    pass


class TranscriptSegmentResponse(TranscriptSegmentBase):
    id: int
    speaker: ParticipantResponse

    model_config = ConfigDict(from_attributes=True)


class ActionItemCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    assignee_id: int | None = None
    due_date: datetime | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Action item title cannot be empty")

        return value


class ActionItemUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    description: str | None = None
    assignee_id: int | None = None
    due_date: datetime | None = None
    completed: bool | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.strip()

        if not value:
            raise ValueError("Action item title cannot be empty")

        return value


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


class MeetingCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    date: datetime
    duration_seconds: int = Field(ge=0)
    summary: str | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Meeting title cannot be empty")

        return value


class MeetingUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    date: datetime | None = None
    duration_seconds: int | None = Field(default=None, ge=0)
    summary: str | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.strip()

        if not value:
            raise ValueError("Meeting title cannot be empty")

        return value


class MeetingListResponse(BaseModel):
    id: int
    title: str
    date: datetime
    duration_seconds: int
    summary: str | None
    participants: list[ParticipantResponse]

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
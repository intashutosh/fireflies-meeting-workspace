from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Table,
    Column,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


meeting_participants = Table(
    "meeting_participants",
    Base.metadata,
    Column(
        "meeting_id",
        ForeignKey("meetings.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "participant_id",
        ForeignKey("participants.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class Meeting(Base):
    __tablename__ = "meetings"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    duration_seconds: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    participants = relationship(
        "Participant",
        secondary=meeting_participants,
        back_populates="meetings",
    )

    transcript_segments = relationship(
        "TranscriptSegment",
        back_populates="meeting",
        cascade="all, delete-orphan",
        order_by="TranscriptSegment.sequence",
    )

    action_items = relationship(
        "ActionItem",
        back_populates="meeting",
        cascade="all, delete-orphan",
    )

    topics = relationship(
        "Topic",
        back_populates="meeting",
        cascade="all, delete-orphan",
    )


class Participant(Base):
    __tablename__ = "participants"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    avatar: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    meetings = relationship(
        "Meeting",
        secondary=meeting_participants,
        back_populates="participants",
    )


class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    meeting_id: Mapped[int] = mapped_column(
        ForeignKey("meetings.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    speaker_id: Mapped[int] = mapped_column(
        ForeignKey("participants.id"),
        nullable=False,
    )

    start_time: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    end_time: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    sequence: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    meeting = relationship(
        "Meeting",
        back_populates="transcript_segments",
    )

    speaker = relationship("Participant")


class ActionItem(Base):
    __tablename__ = "action_items"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    meeting_id: Mapped[int] = mapped_column(
        ForeignKey("meetings.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    assignee_id: Mapped[int | None] = mapped_column(
        ForeignKey("participants.id"),
        nullable=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    due_date: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    meeting = relationship(
        "Meeting",
        back_populates="action_items",
    )

    assignee = relationship("Participant")


class Topic(Base):
    __tablename__ = "topics"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    meeting_id: Mapped[int] = mapped_column(
        ForeignKey("meetings.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    timestamp: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    meeting = relationship(
        "Meeting",
        back_populates="topics",
    )
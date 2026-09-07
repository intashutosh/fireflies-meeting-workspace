# Fireflies Meeting Workspace

A full-stack meeting notes and transcription platform inspired by the workflow of modern meeting intelligence tools such as Fireflies.ai.

Built with Next.js, TypeScript, FastAPI, SQLAlchemy, and SQLite.

## Features

### Meeting Library

- Browse previous meetings
- Meeting title, date, duration, and participants
- Search by meeting title or participant
- Filter by participant
- Sort by newest or oldest
- Create new meetings
- Delete meetings
- Loading, empty, and error states

### Meeting Workspace

- Meeting metadata
- Participant avatars
- Meeting summary
- Topics and chapters
- Action items
- Timestamped transcript
- Transcript search
- Search result highlighting
- Click transcript segment to seek audio
- Audio playback controls
- Active transcript segment follows audio playback

### Meeting CRUD

- Create meetings
- Edit meeting metadata
- Delete meetings
- Persistent SQLite storage

### Transcript

Supports pasted transcript import using:

Speaker: text

Example:

Suyash: Welcome everyone to the meeting.

Rahul: Today we will discuss the product roadmap.

Sanjali: I have prepared the proposed timeline.

The backend parses the transcript, creates participants when required, and stores timestamped transcript segments.

### Action Items

- Create action items
- Edit action items
- Delete action items
- Mark action items complete/incomplete
- Assign action items to participants

---

# Architecture

```text
┌──────────────────────────────┐
│          Next.js             │
│       TypeScript + React     │
│                              │
│  Meeting Library             │
│  Meeting Workspace           │
│  Transcript                  │
│  Action Items                │
│  Audio Player                │
└──────────────┬───────────────┘
               │
               │ REST API / JSON
               ▼
┌──────────────────────────────┐
│           FastAPI            │
│                              │
│  Meeting API                 │
│  Transcript API              │
│  Action Item API             │
│  Validation                  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         SQLAlchemy           │
│                              │
│  ORM + Relationships         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│           SQLite             │
│                              │
│  Meetings                    │
│  Participants                │
│  Transcripts                 │
│  Action Items                │
│  Topics                      │
└──────────────────────────────┘
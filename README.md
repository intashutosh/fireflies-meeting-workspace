# Fireflies Meeting Workspace

A full-stack meeting notes and transcription platform inspired by the workflow of modern meeting intelligence tools such as Fireflies.ai. Recreates the clean, productivity-focused interface, interactive transcripts with audio playback synchronization, AI summaries, action item tracking, and meeting lifecycle management.

---

## Architecture Overview

```text
┌──────────────────────────────────────────────────────────┐
│                     Next.js Frontend                     │
│               (React 19, TypeScript, Tailwind)           │
│                                                          │
│  • Meetings Library & Filtering  • AI Summary & Topics   │
│  • Interactive Transcript Panel  • Action Items Board    │
│  • Bidirectional Audio Player    • Participant Manager   │
└────────────────────────────┬─────────────────────────────┘
                             │
                             │ REST API / JSON
                             ▼
┌──────────────────────────────────────────────────────────┐
│                     FastAPI Backend                      │
│                  (Python 3.13, Pydantic)                 │
│                                                          │
│  • Meetings Router               • Transcripts Router    │
│  • Action Items Router           • Participants Router   │
│  • Transcript Parser             • Request Validation    │
└────────────────────────────┬─────────────────────────────┘
                             │
                             │ SQLAlchemy 2.0 ORM
                             ▼
┌──────────────────────────────────────────────────────────┐
│                      SQLite Database                     │
│                                                          │
│  • meetings                      • participants          │
│  • meeting_participants          • transcript_segments   │
│  • action_items                  • topics                │
└──────────────────────────────────────────────────────────┘
```

---

## 1. Project Overview

The platform replicates the core post-meeting intelligence workflows of Fireflies.ai:

* **Meeting Library & Dashboard**: Browse past meetings with titles, dates, durations, and participant avatars. Filter by participant or date ranges (`Today`, `Last 7 days`, `Last 30 days`), sort by recency, or search across meetings.
* **Meeting Workspace & Detail View**: Dedicated workspace for each meeting displaying full metadata, AI summaries, topic breakdowns, and interactive task management.
* **Interactive Transcript**: Segmented transcript with speaker avatars, speaker names, and timestamps.
* **Bidirectional Audio Sync**: Persistent bottom audio player with seek bar. Clicking any transcript segment immediately seeks the audio player to that timestamp, and playing audio automatically highlights and scrolls the active transcript segment into view.
* **In-Transcript Keyword Search**: Fast transcript search highlighting matching keywords with `<mark>` tags and showing total match counts.
* **AI Summary & Outline**: AI meeting summary accompanied by structured topics/chapters with jump-to-timestamp links.
* **Action Items Management**: Task tracking with checkboxes to toggle completion, ability to add, edit, assign, or delete action items with SQLite persistence.
* **Meeting CRUD & Participant Editing**: Create meetings (with manual entry or pasted/uploaded transcripts), edit title, date, duration, summary, and assign/unassign participants with multi-select checkboxes.
* **Client-Side Transcript Upload**: Import transcripts directly from `.txt`, `.vtt`, or `.json` files into the creation form using browser-native `FileReader`.
* **Polished "Coming Soon" Placeholders**: Integrated modal dialogs for Live Bot/Integrations (Zoom/Google Meet), Team collaboration, Templates, and Workspace Settings.

---

## 2. Tech Stack

### Frontend
* **Framework**: Next.js 16.3.4 (App Router)
* **Library**: React 19.2.8
* **Language**: TypeScript 5
* **Styling**: Tailwind CSS 4
* **Icons**: Lucide React 1.41.0
* **Data Fetching**: Native Fetch API client with typed wrappers (`lib/api.ts`)

### Backend
* **Framework**: FastAPI 1.0.0
* **ASGI Server**: Uvicorn 0.34.0+ (standard)
* **Language**: Python 3.13+
* **ORM**: SQLAlchemy 2.0+
* **Data Validation**: Pydantic v2
* **CORS**: FastAPI CORSMiddleware
* **Database**: SQLite (`backend/fireflies.db`)

---

## 3. Quick Start

### Prerequisites
* **Node.js**: v18+ (v20+ recommended)
* **Python**: 3.11+ (Python 3.13 supported)

---

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   * On Windows:
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\activate
     ```
   * On macOS / Linux:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables (optional)**:
   A default `.env.example` is provided pointing to `sqlite:///./fireflies.db`:
   ```bash
   # Windows PowerShell:
   Copy-Item .env.example .env
   # Linux / macOS:
   cp .env.example .env
   ```

5. **Seed the database**:
   Populates SQLite with 6 realistic meetings, full multi-speaker transcripts, action items, topics, and participants:
   ```bash
   python seed.py
   ```

6. **Start the FastAPI server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend API will be available at `http://127.0.0.1:8000`. Interactive Swagger API docs are available at `http://127.0.0.1:8000/docs`.

---

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables (optional)**:
   A default `.env.example` is provided pointing to `http://127.0.0.1:8000`:
   ```bash
   # Windows PowerShell:
   Copy-Item .env.example .env.local
   # Linux / macOS:
   cp .env.example .env.local
   ```

4. **Start the Next.js development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Database Schema

The database consists of **6 relational tables** defined with SQLAlchemy in `backend/models.py`:

### 1. `meetings`
* **Purpose**: Core entity storing meeting metadata, scheduling, duration, and summary.
* **Primary Key**: `id` (`Integer`, autoincrement)
* **Fields**:
  * `title` (`String(255)`, non-null): Meeting title.
  * `date` (`DateTime`, non-null): Scheduled date/time of the meeting.
  * `duration_seconds` (`Integer`, non-null): Meeting duration in seconds.
  * `summary` (`Text`, nullable): AI-generated summary of the meeting.
  * `created_at` (`DateTime`, non-null, default `datetime.utcnow`).
  * `updated_at` (`DateTime`, non-null, default `datetime.utcnow`, onupdate `datetime.utcnow`).
* **Relationships**:
  * `participants`: Many-to-Many relationship with `Participant` through `meeting_participants`.
  * `transcript_segments`: One-to-Many relationship with `TranscriptSegment` (`cascade="all, delete-orphan"`).
  * `action_items`: One-to-Many relationship with `ActionItem` (`cascade="all, delete-orphan"`).
  * `topics`: One-to-Many relationship with `Topic` (`cascade="all, delete-orphan"`).

### 2. `participants`
* **Purpose**: Individuals attending meetings or speaking in transcripts.
* **Primary Key**: `id` (`Integer`, autoincrement)
* **Fields**:
  * `name` (`String(150)`, non-null): Full name of the participant.
  * `email` (`String(255)`, nullable): Email address.
  * `avatar` (`String(500)`, nullable): Avatar URL or profile asset.
* **Relationships**:
  * `meetings`: Many-to-Many relationship with `Meeting` through `meeting_participants`.

### 3. `meeting_participants`
* **Purpose**: Associative junction table linking meetings and participants in a many-to-many relationship.
* **Composite Primary Key**: `(meeting_id, participant_id)`
* **Foreign Keys**:
  * `meeting_id`: Foreign Key referencing `meetings.id` (`ondelete="CASCADE"`).
  * `participant_id`: Foreign Key referencing `participants.id` (`ondelete="CASCADE"`).

### 4. `transcript_segments`
* **Purpose**: Individual chronological dialogue segments of a meeting transcript.
* **Primary Key**: `id` (`Integer`, autoincrement)
* **Fields**:
  * `meeting_id` (`Integer`, non-null, indexed): Foreign key referencing `meetings.id` (`ondelete="CASCADE"`).
  * `speaker_id` (`Integer`, non-null): Foreign key referencing `participants.id`.
  * `start_time` (`Float`, non-null): Segment start time in seconds.
  * `end_time` (`Float`, non-null): Segment end time in seconds.
  * `text` (`Text`, non-null): Spoken dialogue content.
  * `sequence` (`Integer`, non-null): Sequential order index of the utterance.
* **Relationships**:
  * `meeting`: Belongs to a `Meeting`.
  * `speaker`: Belongs to a `Participant`.

### 5. `action_items`
* **Purpose**: Actionable follow-ups and tasks extracted from meetings.
* **Primary Key**: `id` (`Integer`, autoincrement)
* **Fields**:
  * `meeting_id` (`Integer`, non-null, indexed): Foreign key referencing `meetings.id` (`ondelete="CASCADE"`).
  * `assignee_id` (`Integer`, nullable): Foreign key referencing `participants.id`.
  * `title` (`String(255)`, non-null): Task description/title.
  * `description` (`Text`, nullable): Additional task notes.
  * `due_date` (`DateTime`, nullable): Due date timestamp.
  * `completed` (`Boolean`, non-null, default `False`): Task status.
  * `created_at` (`DateTime`, non-null, default `datetime.utcnow`).
* **Relationships**:
  * `meeting`: Belongs to a `Meeting`.
  * `assignee`: Assigned to an optional `Participant`.

### 6. `topics`
* **Purpose**: Discussion chapters and thematic outlines extracted from meetings.
* **Primary Key**: `id` (`Integer`, autoincrement)
* **Fields**:
  * `meeting_id` (`Integer`, non-null, indexed): Foreign key referencing `meetings.id` (`ondelete="CASCADE"`).
  * `title` (`String(255)`, non-null): Topic header.
  * `description` (`Text`, nullable): Topic summary.
  * `timestamp` (`Float`, nullable): Start timestamp in seconds for seeking.
* **Relationships**:
  * `meeting`: Belongs to a `Meeting`.

---

## 5. API Reference

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/meetings` | Retrieve list of meetings (supports optional `?search=` query parameter). |
| `GET` | `/api/meetings/{id}` | Retrieve a single meeting with participants, transcript segments, action items, and topics. |
| `POST` | `/api/meetings` | Create a new meeting (`title`, `date`, `duration_seconds`, optional `summary`). |
| `PATCH` | `/api/meetings/{id}` | Update meeting metadata (`title`, `date`, `duration_seconds`, `summary`, and `participant_ids`). |
| `DELETE` | `/api/meetings/{id}` | Delete a meeting and cascade deletion to all transcript segments, action items, and topics. |
| `GET` | `/api/participants` | Retrieve all available workspace participants ordered alphabetically by name. |
| `GET` | `/api/transcripts/meeting/{id}` | Retrieve all transcript segments for a meeting in sequential order. |
| `POST` | `/api/transcripts/meeting/{id}` | Create a single transcript segment. |
| `POST` | `/api/transcripts/meeting/{id}/import` | Parse and import a full text transcript in `Speaker: text` format, associating participants. |
| `GET` | `/api/action-items/meeting/{id}` | Retrieve all action items for a meeting. |
| `POST` | `/api/action-items/meeting/{id}` | Create an action item for a meeting (`title`, `description`, `assignee_id`, `due_date`). |
| `PATCH` | `/api/action-items/{id}` | Update an action item (`completed`, `title`, `description`, `assignee_id`, `due_date`). |
| `DELETE` | `/api/action-items/{id}` | Delete an action item. |
| `GET` | `/health` | Health check endpoint returning `{"status": "healthy"}`. |
| `GET` | `/` | Root endpoint returning API name and operational status. |

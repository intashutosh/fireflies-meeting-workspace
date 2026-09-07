from datetime import datetime, timedelta

from database import SessionLocal, Base, engine
from models import (
    Meeting,
    Participant,
    TranscriptSegment,
    ActionItem,
    Topic,
)


def get_or_create_participant(
    db,
    name,
    email,
):
    participant = (
        db.query(Participant)
        .filter(Participant.email == email)
        .first()
    )

    if participant:
        return participant

    participant = Participant(
        name=name,
        email=email,
    )

    db.add(participant)
    db.flush()

    return participant


def create_transcript(
    db,
    meeting,
    speakers,
    lines,
):
    for index, line in enumerate(lines):
        speaker_name, start_time, text = line

        speaker = speakers[speaker_name]

        end_time = start_time + max(
            4,
            min(12, len(text) / 12),
        )

        segment = TranscriptSegment(
            meeting_id=meeting.id,
            speaker_id=speaker.id,
            start_time=start_time,
            end_time=end_time,
            text=text,
            sequence=index,
        )

        db.add(segment)


def create_action_item(
    db,
    meeting,
    title,
    description,
    assignee,
    due_days,
):
    action_item = ActionItem(
        meeting_id=meeting.id,
        title=title,
        description=description,
        assignee_id=assignee.id if assignee else None,
        due_date=(
            datetime.utcnow()
            + timedelta(days=due_days)
            if due_days is not None
            else None
        ),
        completed=False,
    )

    db.add(action_item)


def create_topic(
    db,
    meeting,
    title,
    description,
    timestamp,
):
    topic = Topic(
        meeting_id=meeting.id,
        title=title,
        description=description,
        timestamp=timestamp,
    )

    db.add(topic)


def seed_database():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    existing_meetings = db.query(Meeting).count()

    if existing_meetings > 0:
        print("Database already contains meetings.")
        print("Skipping seed operation.")
        db.close()

    try:
        # --------------------------------------------------
        # Participants
        # --------------------------------------------------

        sarah = get_or_create_participant(
            db,
            "Sarah Chen",
            "sarah@example.com",
        )

        rahul = get_or_create_participant(
            db,
            "Rahul Sharma",
            "rahul@example.com",
        )

        alex = get_or_create_participant(
            db,
            "Alex Kumar",
            "alex@example.com",
        )

        emily = get_or_create_participant(
            db,
            "Emily Johnson",
            "emily@example.com",
        )

        david = get_or_create_participant(
            db,
            "David Wilson",
            "david@example.com",
        )

        priya = get_or_create_participant(
            db,
            "Priya Mehta",
            "priya@example.com",
        )

        james = get_or_create_participant(
            db,
            "James Anderson",
            "james@example.com",
        )

        maria = get_or_create_participant(
            db,
            "Maria Garcia",
            "maria@example.com",
        )

        robert = get_or_create_participant(
            db,
            "Robert Taylor",
            "robert@example.com",
        )

        lisa = get_or_create_participant(
            db,
            "Lisa Brown",
            "lisa@example.com",
        )

        # --------------------------------------------------
        # Meeting 1
        # --------------------------------------------------

        meeting1 = Meeting(
            title="Q4 Product Strategy",
            date=datetime(2026, 9, 5, 10, 0),
            duration_seconds=2520,
            summary=(
                "The team reviewed the Q4 product roadmap, "
                "engineering capacity, launch priorities, "
                "and the proposed October beta release."
            ),
        )

        meeting1.participants = [
            sarah,
            rahul,
            alex,
            emily,
            david,
        ]

        db.add(meeting1)
        db.flush()

        speakers1 = {
            "Sarah": sarah,
            "Rahul": rahul,
            "Alex": alex,
            "Emily": emily,
            "David": david,
        }

        transcript1 = [
            (
                "Sarah",
                5,
                "Thanks everyone for joining. Let's start with the Q4 product roadmap.",
            ),
            (
                "Rahul",
                24,
                "The engineering team has reviewed the current roadmap.",
            ),
            (
                "Alex",
                48,
                "From the product side, onboarding is still our highest priority.",
            ),
            (
                "Emily",
                76,
                "Marketing would like to align the launch campaign with the beta.",
            ),
            (
                "David",
                104,
                "We should make sure the API work is finished before the beta.",
            ),
            (
                "Sarah",
                132,
                "Agreed. Let's target October 14 for the beta release.",
            ),
            (
                "Rahul",
                161,
                "That gives engineering enough time for the remaining work.",
            ),
            (
                "Alex",
                190,
                "I'll update the product roadmap with the new launch date.",
            ),
            (
                "Emily",
                220,
                "I'll prepare the campaign timeline around that date.",
            ),
            (
                "Sarah",
                250,
                "Great. Let's review progress again next week.",
            ),
        ]

        create_transcript(
            db,
            meeting1,
            speakers1,
            transcript1,
        )

        create_topic(
            db,
            meeting1,
            "Q4 Product Roadmap",
            "Review of the major product initiatives planned for Q4.",
            5,
        )

        create_topic(
            db,
            meeting1,
            "Engineering Capacity",
            "Discussion around development bandwidth and API work.",
            104,
        )

        create_topic(
            db,
            meeting1,
            "Beta Launch",
            "Team agreed on an October 14 beta target.",
            132,
        )

        create_action_item(
            db,
            meeting1,
            "Update Q4 product roadmap",
            "Reflect the October 14 beta launch date.",
            alex,
            3,
        )

        create_action_item(
            db,
            meeting1,
            "Prepare marketing campaign timeline",
            "Align campaign milestones with the beta release.",
            emily,
            5,
        )

        create_action_item(
            db,
            meeting1,
            "Complete API readiness review",
            "Verify remaining API work before beta.",
            david,
            7,
        )

        # --------------------------------------------------
        # Meeting 2
        # --------------------------------------------------

        meeting2 = Meeting(
            title="Weekly Engineering Sync",
            date=datetime(2026, 9, 4, 11, 30),
            duration_seconds=1860,
            summary=(
                "Engineering reviewed sprint progress, open blockers, "
                "API development, testing status, and upcoming releases."
            ),
        )

        meeting2.participants = [
            rahul,
            alex,
            david,
            james,
        ]

        db.add(meeting2)
        db.flush()

        speakers2 = {
            "Rahul": rahul,
            "Alex": alex,
            "David": david,
            "James": james,
        }

        transcript2 = [
            (
                "Rahul",
                4,
                "Let's go through the sprint progress first.",
            ),
            (
                "Alex",
                28,
                "The dashboard work is almost complete.",
            ),
            (
                "David",
                51,
                "The API integration is currently blocked by authentication changes.",
            ),
            (
                "James",
                82,
                "I've started testing the new notification system.",
            ),
            (
                "Rahul",
                112,
                "Can we resolve the authentication issue today?",
            ),
            (
                "David",
                139,
                "Yes, I'll coordinate with the platform team.",
            ),
            (
                "Alex",
                168,
                "I'll finish the dashboard tests after the API is available.",
            ),
            (
                "James",
                199,
                "Notification tests should be complete by tomorrow.",
            ),
        ]

        create_transcript(
            db,
            meeting2,
            speakers2,
            transcript2,
        )

        create_topic(
            db,
            meeting2,
            "Sprint Progress",
            "Current progress across engineering workstreams.",
            4,
        )

        create_topic(
            db,
            meeting2,
            "Authentication Blocker",
            "API integration is waiting on authentication changes.",
            51,
        )

        create_topic(
            db,
            meeting2,
            "Testing",
            "Dashboard and notification testing status.",
            168,
        )

        create_action_item(
            db,
            meeting2,
            "Resolve authentication blocker",
            "Coordinate with the platform team.",
            david,
            1,
        )

        create_action_item(
            db,
            meeting2,
            "Complete dashboard tests",
            "Finish tests after API integration is available.",
            alex,
            3,
        )

        create_action_item(
            db,
            meeting2,
            "Finish notification testing",
            "Complete the notification test suite.",
            james,
            2,
        )

        # --------------------------------------------------
        # Meeting 3
        # --------------------------------------------------

        meeting3 = Meeting(
            title="Client Discovery Call",
            date=datetime(2026, 9, 3, 15, 0),
            duration_seconds=2880,
            summary=(
                "The client described their current workflow, reporting "
                "requirements, collaboration challenges, and desired integrations."
            ),
        )

        meeting3.participants = [
            sarah,
            priya,
            maria,
            robert,
        ]

        db.add(meeting3)
        db.flush()

        speakers3 = {
            "Sarah": sarah,
            "Priya": priya,
            "Maria": maria,
            "Robert": robert,
        }

        transcript3 = [
            (
                "Sarah",
                6,
                "Thanks for taking the time today. We'd like to understand your current workflow.",
            ),
            (
                "Priya",
                35,
                "Our biggest challenge is keeping meeting information organized.",
            ),
            (
                "Maria",
                68,
                "We currently store notes across several different tools.",
            ),
            (
                "Robert",
                101,
                "Reporting is another area where we spend a lot of manual effort.",
            ),
            (
                "Sarah",
                137,
                "Would a centralized meeting workspace solve most of that?",
            ),
            (
                "Priya",
                164,
                "Yes, especially if action items could be assigned automatically.",
            ),
            (
                "Maria",
                198,
                "Integration with our existing calendar would also be useful.",
            ),
            (
                "Robert",
                232,
                "We would also need exportable reports for management.",
            ),
        ]

        create_transcript(
            db,
            meeting3,
            speakers3,
            transcript3,
        )

        create_topic(
            db,
            meeting3,
            "Current Workflow",
            "Discussion of how the client currently manages meetings.",
            35,
        )

        create_topic(
            db,
            meeting3,
            "Action Items",
            "Client wants better assignment and tracking of follow-ups.",
            164,
        )

        create_topic(
            db,
            meeting3,
            "Integrations",
            "Calendar and reporting integrations were discussed.",
            198,
        )

        create_action_item(
            db,
            meeting3,
            "Document client workflow",
            "Capture the existing meeting and reporting workflow.",
            sarah,
            3,
        )

        create_action_item(
            db,
            meeting3,
            "Review calendar integration requirements",
            "Document required calendar integration capabilities.",
            maria,
            5,
        )

        # --------------------------------------------------
        # Meeting 4
        # --------------------------------------------------

        meeting4 = Meeting(
            title="Marketing Campaign Review",
            date=datetime(2026, 9, 2, 13, 0),
            duration_seconds=2160,
            summary=(
                "Marketing reviewed campaign messaging, launch channels, "
                "content production, budget allocation, and campaign milestones."
            ),
        )

        meeting4.participants = [
            emily,
            sarah,
            lisa,
            maria,
            alex,
        ]

        db.add(meeting4)
        db.flush()

        speakers4 = {
            "Emily": emily,
            "Sarah": sarah,
            "Lisa": lisa,
            "Maria": maria,
            "Alex": alex,
        }

        transcript4 = [
            (
                "Emily",
                5,
                "Let's review the campaign plan and remaining deliverables.",
            ),
            (
                "Lisa",
                29,
                "The first round of creative assets is ready for review.",
            ),
            (
                "Maria",
                56,
                "The social campaign can start once the final assets are approved.",
            ),
            (
                "Sarah",
                83,
                "I'd like the messaging to emphasize the new onboarding experience.",
            ),
            (
                "Alex",
                112,
                "Product can provide screenshots and product copy this week.",
            ),
            (
                "Emily",
                145,
                "Perfect. Let's lock the creative review for Friday.",
            ),
            (
                "Lisa",
                174,
                "I'll send the updated designs before then.",
            ),
        ]

        create_transcript(
            db,
            meeting4,
            speakers4,
            transcript4,
        )

        create_topic(
            db,
            meeting4,
            "Campaign Messaging",
            "Review of the core campaign message.",
            83,
        )

        create_topic(
            db,
            meeting4,
            "Creative Assets",
            "Status of designs, screenshots, and supporting materials.",
            29,
        )

        create_topic(
            db,
            meeting4,
            "Launch Timeline",
            "Campaign launch depends on final creative approval.",
            145,
        )

        create_action_item(
            db,
            meeting4,
            "Send updated creative designs",
            "Share final designs before Friday review.",
            lisa,
            3,
        )

        create_action_item(
            db,
            meeting4,
            "Provide product screenshots",
            "Prepare screenshots for campaign materials.",
            alex,
            4,
        )

        # --------------------------------------------------
        # Meeting 5
        # --------------------------------------------------

        meeting5 = Meeting(
            title="Senior Engineer Interview",
            date=datetime(2026, 9, 1, 16, 0),
            duration_seconds=3120,
            summary=(
                "The interview covered the candidate's experience with distributed "
                "systems, API design, database architecture, testing, and leadership."
            ),
        )

        meeting5.participants = [
            rahul,
            james,
            priya,
        ]

        db.add(meeting5)
        db.flush()

        speakers5 = {
            "Rahul": rahul,
            "James": james,
            "Priya": priya,
        }

        transcript5 = [
            (
                "Rahul",
                7,
                "Can you walk us through a system you've designed recently?",
            ),
            (
                "Priya",
                34,
                "I designed a service architecture that handled several million requests per day.",
            ),
            (
                "James",
                72,
                "How did you approach database scaling?",
            ),
            (
                "Priya",
                95,
                "We separated read-heavy workloads and introduced caching.",
            ),
            (
                "Rahul",
                131,
                "How did you handle failures between services?",
            ),
            (
                "Priya",
                160,
                "We used retries, timeouts, and circuit breakers.",
            ),
            (
                "James",
                204,
                "What testing strategy did you use?",
            ),
            (
                "Priya",
                225,
                "We combined unit tests with integration and load testing.",
            ),
        ]

        create_transcript(
            db,
            meeting5,
            speakers5,
            transcript5,
        )

        create_topic(
            db,
            meeting5,
            "System Architecture",
            "Discussion of distributed system design experience.",
            7,
        )

        create_topic(
            db,
            meeting5,
            "Database Scaling",
            "Approaches used for scaling read-heavy workloads.",
            72,
        )

        create_topic(
            db,
            meeting5,
            "Testing Strategy",
            "Candidate discussed unit, integration, and load testing.",
            204,
        )

        create_action_item(
            db,
            meeting5,
            "Complete interview feedback",
            "Submit technical interview evaluation.",
            rahul,
            1,
        )

        create_action_item(
            db,
            meeting5,
            "Review architecture discussion",
            "Compare candidate experience against role requirements.",
            james,
            2,
        )

        # --------------------------------------------------
        # Meeting 6
        # --------------------------------------------------

        meeting6 = Meeting(
            title="Sprint Retrospective",
            date=datetime(2026, 8, 30, 17, 0),
            duration_seconds=1740,
            summary=(
                "The team discussed sprint successes, recurring blockers, "
                "communication improvements, testing practices, and priorities for the next sprint."
            ),
        )

        meeting6.participants = [
            sarah,
            rahul,
            alex,
            david,
            james,
            lisa,
        ]

        db.add(meeting6)
        db.flush()

        speakers6 = {
            "Sarah": sarah,
            "Rahul": rahul,
            "Alex": alex,
            "David": david,
            "James": james,
            "Lisa": lisa,
        }

        transcript6 = [
            (
                "Sarah",
                4,
                "Let's start with what went well during the sprint.",
            ),
            (
                "Rahul",
                27,
                "The API work moved faster than expected.",
            ),
            (
                "Alex",
                53,
                "The main issue was late changes to requirements.",
            ),
            (
                "David",
                81,
                "Those changes also affected testing timelines.",
            ),
            (
                "James",
                108,
                "We should involve QA earlier in the planning process.",
            ),
            (
                "Lisa",
                137,
                "I'd also like clearer ownership for design changes.",
            ),
            (
                "Sarah",
                165,
                "Let's make both of those changes for the next sprint.",
            ),
            (
                "Rahul",
                194,
                "I'll add them to our sprint planning checklist.",
            ),
        ]

        create_transcript(
            db,
            meeting6,
            speakers6,
            transcript6,
        )

        create_topic(
            db,
            meeting6,
            "What Went Well",
            "Review of successful sprint activities.",
            4,
        )

        create_topic(
            db,
            meeting6,
            "Requirements Changes",
            "Late requirement changes affected implementation and testing.",
            53,
        )

        create_topic(
            db,
            meeting6,
            "Process Improvements",
            "Team discussed earlier QA involvement and clearer ownership.",
            108,
        )

        create_action_item(
            db,
            meeting6,
            "Update sprint planning checklist",
            "Include earlier QA involvement and ownership checks.",
            rahul,
            3,
        )

        create_action_item(
            db,
            meeting6,
            "Define design ownership process",
            "Create a clearer process for design changes.",
            lisa,
            5,
        )

        db.commit()

        print("Database seeded successfully.")
        print("Created 6 meetings.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
import re


def parse_transcript(transcript: str):
    segments = []

    lines = transcript.splitlines()

    for index, line in enumerate(lines):
        line = line.strip()

        if not line:
            continue

        match = re.match(
            r"^([^:]+):\s*(.+)$",
            line,
        )

        if not match:
            continue

        speaker_name = match.group(1).strip()
        text = match.group(2).strip()

        segments.append(
            {
                "speaker_name": speaker_name,
                "text": text,
                "sequence": index,
            }
        )

    return segments
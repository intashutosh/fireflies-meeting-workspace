import re


SPEAKER_LINE_PATTERN = re.compile(
    r"^([^:]{1,150}):\s*(.+)$"
)


def parse_transcript(transcript: str):
    segments = []

    if not transcript or not transcript.strip():
        return segments

    lines = transcript.splitlines()

    for line in lines:
        line = line.strip()

        if not line:
            continue

        match = SPEAKER_LINE_PATTERN.match(line)

        if not match:
            continue

        speaker_name = match.group(1).strip()
        text = match.group(2).strip()

        if not speaker_name or not text:
            continue

        segments.append(
            {
                "speaker_name": speaker_name,
                "text": text,
                "sequence": len(segments),
            }
        )

    return segments
import re

FILLERS = re.compile(r"\b(?:um+|uh+|er+m?|ah+|hm+|you know|i mean|basically|literally)\b", re.IGNORECASE)
PAUSE_SECONDS = 1.0


def speech_metrics(transcript, words, duration, response_time):
    timed = [word for word in words if "start" in word and "end" in word]
    gaps = [after["start"] - before["end"] for before, after in zip(timed, timed[1:])]
    pauses = [gap for gap in gaps if gap >= PAUSE_SECONDS]
    span = timed[-1]["end"] - timed[0]["start"] if len(timed) > 1 else duration
    return {
        "words": len(transcript.split()),
        "duration": round(duration, 1),
        "speaking_time": round(max(span, 1.0), 1),
        "fillers": len(FILLERS.findall(transcript)),
        "pauses": len(pauses),
        "pause_seconds": round(sum(pauses), 1),
        "response_time": round(response_time, 1),
    }
import time

from app.interview import prompts
from app.interview.engine import TECH_ROUNDS

TECHNICAL = (
    ("Correctness", "correctness"),
    ("Relevance", "relevance"),
    ("Depth", "depth"),
    ("Problem solving", "problem_solving"),
)
COMMUNICATION = (("Clarity", "clarity"), ("Structure", "structure"))
KNOWLEDGE_KEYS = ("correctness", "relevance", "depth")


def mean(values):
    values = list(values)
    return sum(values) / len(values) if values else 0


def category(turns, rubric):
    if not turns:
        return []
    return [[label, round(mean(turn["scores"][key] for turn in turns) * 10)] for label, key in rubric]


def knowledge(turns):
    rows = []
    for round_name in ("resume", "project"):
        scored = [turn for turn in turns if turn["round"] == round_name]
        if scored:
            score = mean(turn["scores"][key] for turn in scored for key in KNOWLEDGE_KEYS) * 10
            rows.append([f"{round_name.title()} knowledge", round(score)])
    return rows


def speech_rows(turns):
    speech = [turn["speech"] for turn in turns]
    minutes = sum(item["speaking_time"] for item in speech) / 60
    pauses = sum(item["pauses"] for item in speech)
    return [
        ["Speaking rate", f"{sum(item['words'] for item in speech) / minutes:.0f} words/min"],
        ["Filler words", f"{sum(item['fillers'] for item in speech) / minutes:.1f} per min"],
        ["Long pauses (1 s or more)", str(pauses)],
        ["Average pause", f"{sum(item['pause_seconds'] for item in speech) / pauses:.1f} s" if pauses else "None"],
        ["Average response time", f"{mean(item['response_time'] for item in speech):.1f} s"],
        ["Average answer length", f"{mean(item['duration'] for item in speech):.0f} s"],
    ]


def visual_rows(visual):
    if not visual:
        return []
    return [
        ["Face visibility", f"{visual.face_visibility:.0f}%"],
        ["Camera-facing ratio", f"{visual.camera_facing:.0f}%"],
        ["Look-away events", f"{visual.look_aways_per_min:.1f} per min"],
        ["Head movements", f"{visual.head_moves_per_min:.1f} per min"],
    ]


def build_report(config, profile, state, visual):
    turns = state["turns"]
    technical = category([turn for turn in turns if turn["round"] in TECH_ROUNDS], TECHNICAL)
    communication = category(turns, COMMUNICATION)
    knowledge_rows = knowledge(turns)
    weighted = [(weight, mean(score for _, score in rows)) for weight, rows in ((0.7, technical), (0.3, communication)) if rows]
    overall = round(sum(weight * score for weight, score in weighted) / sum(weight for weight, _ in weighted))
    speech = speech_rows(turns)
    visual_data = visual_rows(visual)
    questions = [
        {
            "question": turn["question"],
            "round": turn["round"],
            "kind": turn["kind"],
            "answer_summary": turn["summary"],
            "score": round(mean(turn["scores"].values()) * 10),
            "feedback": turn["feedback"],
        }
        for turn in turns
    ]
    written = prompts.write_report(
        {
            "field": config["field"],
            "experience": config["experience"],
            "technical": technical,
            "communication": communication,
            "knowledge": knowledge_rows,
            "answers": questions,
            "speech": speech,
            "visual": visual_data,
        }
    )
    return {
        "candidate": profile["name"],
        "field": config["field"],
        "experience": config["experience"],
        "interview_type": config["type"],
        "duration": round(time.time() - state["started_at"]),
        "question_count": len(turns),
        "overall": overall,
        "technical": technical,
        "communication": communication,
        "knowledge": knowledge_rows,
        "speech": speech,
        "visual": visual_data,
        "questions": questions,
        **written,
    }
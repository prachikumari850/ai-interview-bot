import json
import random
import time
from pathlib import Path

from app.interview import prompts
from app.services.llm import LLMError

BANK = json.loads((Path(__file__).resolve().parents[2] / "questions" / "bank.json").read_text(encoding="utf-8"))

LEVELS = ["easy", "medium", "hard"]
START_LEVEL = {"Fresher": 0, "1-3 years": 1, "3+ years": 2}
FIXED_LEVEL = {"Easy": 0, "Medium": 1, "Hard": 2}
ROUND_ORDER = ["resume", "fundamentals", "project", "technical", "behavioral"]
MIDDLE_ROUNDS = {
    "Technical": ["resume", "fundamentals", "project", "technical"],
    "HR": ["resume", "behavioral"],
    "Technical + HR": ["resume", "fundamentals", "project", "technical", "behavioral"],
}
TECH_ROUNDS = {"resume", "fundamentals", "project", "technical"}
MAX_FOLLOWUPS = 2
NO_FOLLOWUP_ROUNDS = {"introduction", "final"}
FIELD_TOPICS = {
    "AI/ML": ["AI/ML", "Data Science", "Programming", "Problem Solving"],
    "Data Science": ["Data Science", "AI/ML", "Database", "Programming", "Problem Solving"],
    "Web Development": ["Web Development", "Programming", "Database", "Problem Solving"],
    "Backend": ["Programming", "Database", "Web Development", "Problem Solving"],
    "Full Stack": ["Web Development", "Programming", "Database", "Problem Solving"],
    "General": ["Programming", "Problem Solving", "Database", "Web Development"],
}


def build_plan(config):
    slots = max(config["duration"] // 2, 4) - 2
    middle = MIDDLE_ROUNDS[config["type"]]
    chosen = sorted((middle[i % len(middle)] for i in range(slots)), key=ROUND_ORDER.index)
    return ["introduction", *chosen, "final"]


def time_up(state, config):
    return time.time() - state["started_at"] >= config["duration"] * 60


def pick_from_bank(state, profile, config, round_name):
    topics = FIELD_TOPICS[config["field"]]
    unused = [q for q in BANK if q["type"] == round_name and q["id"] not in state["asked"]]
    pool = [q for q in unused if q["topic"] in topics] or unused or [q for q in BANK if q["type"] == round_name]
    known = {skill.lower() for skill in profile["skills"] + profile["technologies"]}

    def rank(question):
        overlap = len(known & {skill.lower() for skill in question["skills"]})
        return (-abs(LEVELS.index(question["difficulty"]) - state["level"]), overlap, random.random())

    chosen = max(pool, key=rank)
    state["asked"].append(chosen["id"])
    return {"text": chosen["question"], "round": round_name, "kind": "main"}


def next_main(state, profile, config):
    round_name = state["plan"][state["index"]]
    if round_name in ("resume", "project"):
        asked = [turn["question"] for turn in state["turns"] if turn["round"] == round_name]
        try:
            text = prompts.generate_question(round_name, profile, config, LEVELS[state["level"]], asked)
            return {"text": text, "round": round_name, "kind": "main"}
        except LLMError:
            round_name = "fundamentals"
    return pick_from_bank(state, profile, config, round_name) 


def start(config, profile):
    state = {
        "plan": build_plan(config),
        "index": 0,
        "level": FIXED_LEVEL.get(config["difficulty"], START_LEVEL[config["experience"]]),
        "asked": [],
        "turns": [],
        "pending": None,
        "followups": 0,
        "followups_total": 0,
        "answered": False,
        "finished": False,
        "started_at": time.time(),
    }
    state["current"] = next_main(state, profile, config)
    return state


def public(state):
    return {**state["current"], "number": len(state["turns"]) + 1}


def record_answer(state, config, profile, transcript, speech):
    current = state["current"]
    result = prompts.evaluate(
        current["text"], transcript, profile, config, current["round"]
    )
    scores = result["scores"]

    state["turns"].append(
        {
            "question": current["text"],
            "round": current["round"],
            "kind": current["kind"],
            "answer": transcript,
            "speech": speech,
            "scores": scores,
            "summary": result["summary"],
            "feedback": result["feedback"],
        }
    )
    state["answered"] = True

    can_follow_up = False

    if config["difficulty"] == "Adaptive" and current["round"] in TECH_ROUNDS:
        average = (
            scores["correctness"]
            + scores["relevance"]
            + scores["depth"]
        ) / 3

        if average >= 7.5:
            state["level"] = min(state["level"] + 1, 2)
        elif average <= 4:
            state["level"] = max(state["level"] - 1, 0)

        can_follow_up = (
            current["round"] not in NO_FOLLOWUP_ROUNDS
            and state["followups"] < MAX_FOLLOWUPS
            and state["followups_total"] < len(state["plan"]) // 2
            and not time_up(state, config)
        )

    state["pending"] = result["followup"] if can_follow_up else None



def advance(state, config, profile):
    if not state["answered"] or state["finished"]:
        return
    state["answered"] = False
    if state["pending"]:
        state["current"] = {"text": state["pending"], "round": state["current"]["round"], "kind": "followup"}
        state["pending"] = None
        state["followups"] += 1
        state["followups_total"] += 1
        return
    state["index"] += 1
    state["followups"] = 0
    if state["index"] >= len(state["plan"]) or time_up(state, config):
        state["finished"] = True
    else:
        state["current"] = next_main(state, profile, config)
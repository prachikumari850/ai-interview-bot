import json

from app.services.llm import FAST_MODEL, LLMError, json_chat

SCORES = ("correctness", "relevance", "depth", "problem_solving", "clarity", "structure")
FOCUS = {
    "resume": "the candidate's education, work experience, skills or certifications",
    "project": "one specific project from the resume: design decisions, technology choices, challenges or results",
}


def as_strings(value):
    return [str(item).strip() for item in value if str(item).strip()] if isinstance(value, list) else []


def clamp_score(value):
    try:
        return max(0, min(10, round(float(value))))
    except (TypeError, ValueError, OverflowError):
        return 0


def profile_brief(profile):
    projects = "; ".join(
        f"{p['name']} [{', '.join(p['technologies'][:6])}]: {p['summary']}" for p in profile["projects"][:4]
    )
    return (
        f"Skills: {', '.join(profile['skills'][:15])}\n"
        f"Experience: {'; '.join(profile['experience'][:3])}\n"
        f"Projects: {projects}"
    )


def build_profile(resume_text):
    system = (
        "You extract structured data from resumes. Reply with JSON only, using exactly these keys: "
        "name (string), education (list of short strings), skills (list of strings), "
        "technologies (list of strings), experience (list of short strings), "
        "projects (list of objects with name, technologies (list of strings) and summary (one sentence)), "
        "certifications (list of strings), achievements (list of short strings). "
        "Keep it compact: at most 15 skills and 6 projects. Use only information from the resume. "
        "Use empty lists when information is missing."
    )
    raw = json_chat(system, resume_text[:12000], max_tokens=1500)
    projects = raw.get("projects")
    return {
        "name": str(raw.get("name") or "Candidate"),
        "education": as_strings(raw.get("education")),
        "skills": as_strings(raw.get("skills")),
        "technologies": as_strings(raw.get("technologies")),
        "experience": as_strings(raw.get("experience")),
        "certifications": as_strings(raw.get("certifications")),
        "achievements": as_strings(raw.get("achievements")),
        "projects": [
            {
                "name": str(p.get("name") or ""),
                "technologies": as_strings(p.get("technologies")),
                "summary": str(p.get("summary") or ""),
            }
            for p in (projects if isinstance(projects, list) else [])
            if isinstance(p, dict)
        ],
    }


def evaluate(question, answer, profile, config, round_name):
    system = (
        "You are a fair but demanding interviewer evaluating one spoken answer. Reply with JSON only with these keys: "
        "correctness, relevance, depth, problem_solving, clarity, structure (integers from 0 to 10), "
        "summary (one sentence describing what the candidate said), "
        "feedback (one or two sentences of specific, constructive feedback), "
        "followup (one short question probing something specific in the answer, or null if none is needed). "
        "Correctness is technical accuracy; for behavioral questions it is how credible and specific the answer is. "
        "Depth is the level of detail and reasoning. problem_solving is the quality of the approach. "
        "The answer is an automatic speech transcript, so ignore transcription errors and filler words. "
        "An empty or irrelevant answer scores 0 to 2."
    )
    user = (
        f"Role: {config['field']} ({config['experience']}). Interview round: {round_name}.\n"
        f"Candidate background:\n{profile_brief(profile)}\n\n"
        f"Question: {question}\n\nAnswer: {answer[:3000]}"
    )
    result = json_chat(system, user, max_tokens=500)
    followup = result.get("followup")
    followup = followup.strip() if isinstance(followup, str) else ""
    return {
        "scores": {key: clamp_score(result.get(key)) for key in SCORES},
        "summary": str(result.get("summary") or ""),
        "feedback": str(result.get("feedback") or ""),
        "followup": None if followup.lower() in ("", "null", "none") else followup,
    }


def generate_question(round_name, profile, config, level, asked):
    system = (
        "You are an interviewer. Write exactly one interview question. "
        'Reply with JSON only: {"question": "..."}. '
        "The question must be specific to the candidate's resume, answerable aloud in under two minutes, "
        "and at most 30 words. If the resume has nothing relevant, ask about the candidate's strongest listed skill."
    )
    user = (
        f"Role: {config['field']} ({config['experience']}). Difficulty: {level}.\n"
        f"Focus on {FOCUS[round_name]}.\n"
        f"Candidate:\n{profile_brief(profile)}\n"
        f"Do not repeat these earlier questions: {json.dumps(asked)}"
    )
    question = json_chat(system, user, model=FAST_MODEL, max_tokens=150).get("question")
    if not isinstance(question, str) or not question.strip():
        raise LLMError("The AI service did not return a question.")
    return question.strip()


def write_report(data):
    system = (
        "You write the summary section of a mock interview report. Reply with JSON only with these keys: "
        "summary (3 to 4 sentences), strengths (3 to 5 short strings), improvements (3 to 5 short strings), "
        "recommendations (3 to 5 concrete interview preparation tips). "
        "Base everything only on the data provided. Never make claims about emotions, personality, honesty or nervousness."
    )
    result = json_chat(system, json.dumps(data), max_tokens=900)
    return {
        "summary": str(result.get("summary") or ""),
        "strengths": as_strings(result.get("strengths")),
        "improvements": as_strings(result.get("improvements")),
        "recommendations": as_strings(result.get("recommendations")),
    }
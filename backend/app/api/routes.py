from typing import Annotated

from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified

from app.db import get_db
from app.interview import engine, prompts
from app.interview.report import build_report
from app.models import Interview
from app.schemas import DifficultyMode, ExperienceLevel, FieldName, Finish, InterviewType
from app.services import llm, speech
from app.services.resume import extract_text

router = APIRouter(prefix="/api/sessions")

MAX_RESUME_BYTES = 5 * 1024 * 1024
MAX_AUDIO_BYTES = 20 * 1024 * 1024


def get_interview(db: Session, interview_id: str) -> Interview:
    interview = db.get(Interview, interview_id)
    if not interview:
        raise HTTPException(404, "Interview not found.")
    return interview

def save(db: Session, interview: Interview, **fields):
    for name, value in fields.items():
        setattr(interview, name, value)
        flag_modified(interview, name)
    db.commit()

@router.post("")
def create_interview(
    resume: UploadFile,
    field: Annotated[FieldName, Form()],
    experience: Annotated[ExperienceLevel, Form()],
    interview_type: Annotated[InterviewType, Form(alias="type")],
    difficulty: Annotated[DifficultyMode, Form()],
    duration: Annotated[int, Form(ge=5, le=60)],
    db: Session = Depends(get_db),
):
    data = resume.file.read(MAX_RESUME_BYTES + 1)
    if len(data) > MAX_RESUME_BYTES:
        raise HTTPException(413, "The resume must be under 5 MB.")
    if not data.startswith(b"%PDF"):
        raise HTTPException(400, "Please upload a PDF file.")
    try:
        text = extract_text(data)
    except Exception:
        raise HTTPException(400, "This PDF could not be read.") from None
    if len(text) < 50:
        raise HTTPException(400, "No readable text found in this PDF. Please upload a text-based resume.")

    config = {
        "field": field,
        "experience": experience,
        "type": interview_type,
        "difficulty": difficulty,
        "duration": duration,
    }
    profile = prompts.build_profile(text)
    state = engine.start(config, profile)
    interview = Interview(config=config, profile=profile, state=state)
    db.add(interview)
    db.commit()
    return {"session_id": interview.id, "seconds": duration * 60, "question": engine.public(state)}

@router.post("/{interview_id}/answer")
def answer(
    interview_id: str,
    audio: UploadFile,
    duration: Annotated[float, Form(ge=0)],
    response_time: Annotated[float, Form(ge=0)],
    db: Session = Depends(get_db),
):
    interview = get_interview(db, interview_id)
    state = interview.state
    if state["finished"] or state["answered"]:
        raise HTTPException(409, "This question has already been answered.")
    if duration < 1:
        raise HTTPException(400, "The answer was too short. Please try again.")
    data = audio.file.read(MAX_AUDIO_BYTES + 1)
    if len(data) > MAX_AUDIO_BYTES:
        raise HTTPException(413, "The recording is too large.")

    transcription = llm.transcribe(data, audio.filename or "answer.webm")
    transcript = transcription["text"].strip()
    if not transcript:
        raise HTTPException(400, "We could not hear an answer. Please check your microphone and try again.")

    metrics = speech.speech_metrics(transcript, transcription["words"], duration, response_time)
    engine.record_answer(state, interview.config, interview.profile, transcript, metrics)
    save(db, interview, state=state)
    return {"transcript": transcript, "speech": metrics}


@router.post("/{interview_id}/next")
def next_question(interview_id: str, db: Session = Depends(get_db)):
    interview = get_interview(db, interview_id)
    state = interview.state
    engine.advance(state, interview.config, interview.profile)
    save(db, interview, state=state)
    return {"finished": state["finished"], "question": None if state["finished"] else engine.public(state)}

@router.post("/{interview_id}/finish")
def finish(interview_id: str, body: Finish, db: Session = Depends(get_db)):
    interview = get_interview(db, interview_id)
    if interview.report:
        return interview.report
    if not interview.state["turns"]:
        raise HTTPException(400, "Answer at least one question to get a report.")
    report = build_report(interview.config, interview.profile, interview.state, body.visual)
    save(db, interview, report=report, state={**interview.state, "finished": True})
    return report


@router.get("/{interview_id}/report")
def get_report(interview_id: str, db: Session = Depends(get_db)):
    interview = get_interview(db, interview_id)
    if not interview.report:
        raise HTTPException(404, "This report is not ready yet.")
    return interview.report
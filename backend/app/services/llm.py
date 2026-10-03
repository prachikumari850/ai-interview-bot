import json
import os
from functools import lru_cache

from dotenv import load_dotenv
from groq import Groq, GroqError

load_dotenv()

# MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
FAST_MODEL = os.getenv("GROQ_FAST_MODEL", "llama-3.1-8b-instant")
SPEECH_MODEL = os.getenv("GROQ_SPEECH_MODEL", "whisper-large-v3-turbo")


class LLMError(Exception):
    pass


@lru_cache
def client():
    return Groq(api_key=os.getenv("GROQ_API_KEY"))


def json_chat(system, user, model=MODEL, max_tokens=800):
    try:
        response = client().chat.completions.create(
            model=model,
            messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=max_tokens,
        )
        data = json.loads(response.choices[0].message.content)
    except (GroqError, json.JSONDecodeError, TypeError) as error:
        raise LLMError(f"AI service error: {error}") from error
    if not isinstance(data, dict):
        raise LLMError("The AI service returned an unexpected response.")
    return data

FILLER_PROMPT = "Umm, so, uh, you know, I mean, hmm... okay, let me think."


def transcribe(audio, filename):
    try:
        result = client().audio.transcriptions.create(
            file=(filename, audio),
            model=SPEECH_MODEL,
            response_format="verbose_json",
            timestamp_granularities=["word"],
            language="en",
            prompt=FILLER_PROMPT,
            temperature=0,
        ).model_dump()
    except GroqError as error:
        raise LLMError(f"Speech-to-text error: {error}") from error
    return {"text": result.get("text") or "", "words": result.get("words") or []}
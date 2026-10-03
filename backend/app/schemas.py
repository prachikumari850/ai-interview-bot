from typing import Literal

from pydantic import BaseModel, Field

FieldName = Literal["AI/ML", "Data Science", "Web Development", "Backend", "Full Stack", "General"]
ExperienceLevel = Literal["Fresher", "1-3 years", "3+ years"]
InterviewType = Literal["Technical", "HR", "Technical + HR"]
DifficultyMode = Literal["Easy", "Medium", "Hard", "Adaptive"]


class Visual(BaseModel):
    face_visibility: float = Field(ge=0, le=100)
    camera_facing: float = Field(ge=0, le=100)
    look_aways_per_min: float = Field(ge=0)
    head_moves_per_min: float = Field(ge=0)


class Finish(BaseModel):
    visual: Visual | None = None
from __future__ import annotations

from pydantic import BaseModel, Field


class InterviewPrepRequest(BaseModel):
    applicationId: str
    resumeText: str
    focusAreas: list[str] = Field(default_factory=list)


class InterviewPrepResponse(BaseModel):
    applicationId: str
    talkingPoints: list[str]
    likelyQuestions: list[str]
    questionsToAskEmployer: list[str]
    prepChecklist: list[str] = Field(default_factory=list)
    reasoning: list[str]

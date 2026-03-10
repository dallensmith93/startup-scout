from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


ApplicationStatus = Literal["saved", "tailoring", "applied", "interview", "offer", "rejected"]


class ApplicationRecord(BaseModel):
    id: str
    startupId: str
    startupName: str
    roleTitle: str
    location: str
    compensationBand: str
    roleSummary: str
    jobDescription: str
    requiredSkills: list[str]
    niceToHaveSkills: list[str] = Field(default_factory=list)
    riskSignals: list[str] = Field(default_factory=list)
    status: ApplicationStatus = "saved"
    stage: str = "application"
    lastTouchAt: str


class ApplicationFitRequest(BaseModel):
    resumeText: str
    keySkills: list[str] = Field(default_factory=list)
    candidateHighlights: list[str] = Field(default_factory=list)


class FitCategory(BaseModel):
    label: str
    score: int = Field(ge=0, le=100)
    reasoning: list[str]


class KeywordGapReport(BaseModel):
    matchedKeywords: list[str]
    missingKeywords: list[str]
    overlapScore: int = Field(ge=0, le=100)


class ApplicationFitResponse(BaseModel):
    applicationId: str
    fitScore: int = Field(ge=0, le=100)
    fitSummary: FitCategory
    riskSummary: FitCategory
    keywordGapReport: KeywordGapReport
    tailoredIntroParagraph: str
    tailoredResumeBullets: list[str]
    strongestRelevantExperience: str
    recommendedNextStep: str
    evidence: dict[str, object]
    reasoning: list[str]

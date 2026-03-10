from __future__ import annotations

from pydantic import BaseModel, Field

from app.models.application import KeywordGapReport


class TailoringAnalyzeRequest(BaseModel):
    applicationId: str
    jobDescription: str = ""
    resumeText: str
    keySkills: list[str] = Field(default_factory=list)
    currentBullets: list[str] = Field(default_factory=list)


class TailoringAnalyzeResponse(BaseModel):
    applicationId: str
    matchScore: int = Field(ge=0, le=100)
    keywordAnalysis: list[str]
    tailoredIntroParagraph: str
    suggestedBullets: list[str]
    resumeDiffSummary: list[str]
    keywordGapReport: KeywordGapReport
    strongestRelevantExperience: str
    reasoning: list[str]

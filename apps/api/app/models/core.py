from __future__ import annotations

from pydantic import BaseModel, Field


class Intelligence(BaseModel):
    marketCategory: str
    fundingStage: str
    hiringProbability: int
    founderSignals: list[str]
    aiFocus: list[str]
    summary: str


class StartupRecord(BaseModel):
    id: str
    name: str
    domain: str
    website: str
    location: str
    description: str
    firstSeenAt: str
    tags: list[str]
    openRoles: list[str]
    score: int
    scoreBreakdown: dict[str, int]
    whyNow: list[str]
    intelligence: Intelligence


class RankingItem(StartupRecord):
    rank: int


class HiddenSignal(BaseModel):
    id: str
    startupId: str
    startupName: str
    signal: str
    confidence: float = Field(ge=0.0, le=1.0)
    whyItMatters: str


class OutreachRequest(BaseModel):
    startupId: str
    tone: str
    candidateName: str
    candidatePitch: str


class OutreachResponse(BaseModel):
    subject: str
    message: str
    highlights: list[str]


class ResumeMatchRequest(BaseModel):
    startupId: str
    resumeText: str
    keySkills: list[str]


class ResumeMatchResponse(BaseModel):
    fitScore: int
    strengths: list[str]
    skillGaps: list[str]
    recommendations: list[str]

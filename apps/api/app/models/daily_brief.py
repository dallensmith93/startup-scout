from __future__ import annotations

from pydantic import BaseModel, Field


class PriorityBriefItem(BaseModel):
    applicationId: str
    startupName: str
    roleTitle: str
    priorityScore: int = Field(ge=0, le=100)
    reason: str


class FollowupDueItem(BaseModel):
    applicationId: str
    startupName: str
    roleTitle: str
    dueDate: str
    daysUntilDue: int
    reason: str


class QuickWinItem(BaseModel):
    applicationId: str
    startupName: str
    roleTitle: str
    impactScore: int = Field(ge=0, le=100)
    reason: str
    recommendedAction: str


class RiskWatchItem(BaseModel):
    applicationId: str
    startupName: str
    roleTitle: str
    riskScore: int = Field(ge=0, le=100)
    severity: str
    reason: str
    recommendedAction: str


class DailyBriefResponse(BaseModel):
    generatedForDate: str
    topPriorities: list[PriorityBriefItem]
    followupsDue: list[FollowupDueItem]
    quickWins: list[QuickWinItem]
    riskWatch: list[RiskWatchItem]
    reason: str

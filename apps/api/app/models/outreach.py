from __future__ import annotations

from pydantic import BaseModel, Field


class FollowupDraft(BaseModel):
    contactId: str
    contactName: str = ""
    company: str = ""
    title: str
    draft: str
    priorityScore: int = Field(default=0, ge=0, le=100)
    priorityReason: str = ""
    recommendedSendWindow: str = ""
    recommendedSendWindowReason: str = ""
    reason: str


class ReferralAsk(BaseModel):
    contactId: str
    contactName: str = ""
    ask: str
    confidenceScore: int = Field(default=0, ge=0, le=100)
    confidenceReason: str = ""
    reason: str


class OutreachContext(BaseModel):
    headline: str
    plays: list[str]
    reason: str


class OutreachHubResponse(BaseModel):
    generatedForDate: str
    focus: str
    focusReason: str = ""
    tone: str
    toneReason: str = ""
    context: OutreachContext
    followupDrafts: list[FollowupDraft]
    referralAsks: list[ReferralAsk]
    reason: str


class WarmPathItem(BaseModel):
    contactId: str
    name: str
    company: str
    pathScore: int = Field(ge=0, le=100)
    pathScoreReason: str = ""
    introLikelihood: int = Field(ge=0, le=100)
    introLikelihoodReason: str = ""
    recommendedPath: str = ""
    recommendedPathReason: str = ""
    reason: str


class WarmPathsSummary(BaseModel):
    total: int = Field(default=0, ge=0)
    topScore: int = Field(default=0, ge=0, le=100)
    averageScore: int = Field(default=0, ge=0, le=100)
    reason: str = ""


class WarmPathsResponse(BaseModel):
    generatedForDate: str
    summary: WarmPathsSummary | None = None
    items: list[WarmPathItem]
    reason: str

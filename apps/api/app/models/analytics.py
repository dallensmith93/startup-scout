from __future__ import annotations

from pydantic import BaseModel, Field


class FunnelMetrics(BaseModel):
    saved: int
    tailoring: int
    applied: int
    interview: int
    offer: int
    rejected: int


class OutreachPerformanceInsight(BaseModel):
    title: str
    value: str
    urgency: str
    reason: str


class AnalyticsResponse(BaseModel):
    applicationsTotal: int
    responseRate: int = Field(ge=0, le=100)
    interviewRate: int = Field(ge=0, le=100)
    momentumScore: int = Field(ge=0, le=100)
    funnel: FunnelMetrics
    outreachSent: int
    outreachResponses: int
    outreachPerformanceInsights: list[OutreachPerformanceInsight] = Field(default_factory=list)
    reason: str

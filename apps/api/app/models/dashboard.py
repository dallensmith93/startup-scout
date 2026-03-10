from __future__ import annotations

from pydantic import BaseModel, Field


class SummaryMetric(BaseModel):
    label: str
    value: int
    target: int
    reason: str


class PipelineSnapshotItem(BaseModel):
    stage: str
    count: int


class OpportunityHighlight(BaseModel):
    applicationId: str
    startupName: str
    roleTitle: str
    score: int = Field(ge=0, le=100)
    reason: str


class RiskAlert(BaseModel):
    applicationId: str
    headline: str
    severity: str
    reason: str


class OpportunityDecayItem(BaseModel):
    applicationId: str
    startupName: str
    roleTitle: str
    daysSinceLastTouch: int = Field(ge=0)
    daysToDue: int
    decayScore: int = Field(ge=0, le=100)
    urgency: str
    timeWindow: str
    nextAction: str
    reason: str


class ActionQueueSummary(BaseModel):
    total: int = Field(ge=0)
    critical: int = Field(ge=0)
    high: int = Field(ge=0)
    topReason: str


class StuckInsight(BaseModel):
    headline: str
    cause: str
    evidence: list[str]
    unblockActions: list[str]


class ActionQueuePreviewItem(BaseModel):
    id: str
    title: str
    actionType: str
    priority: str
    etaMinutes: int = Field(ge=5, le=180)
    reason: str


class DashboardResponse(BaseModel):
    momentumScore: int = Field(ge=0, le=100)
    weeklyFocusScore: int = Field(ge=0, le=100)
    weeklyFocusTarget: int = Field(ge=0, le=100)
    weeklyFocusReason: str
    summaryMetrics: list[SummaryMetric]
    pipelineSnapshot: list[PipelineSnapshotItem]
    topOpportunities: list[OpportunityHighlight]
    riskAlerts: list[RiskAlert]
    opportunityDecay: list[OpportunityDecayItem]
    stuckInsight: StuckInsight
    whyStuck: str
    actionQueuePreview: list[ActionQueuePreviewItem]
    actionQueue: ActionQueueSummary
    reason: str

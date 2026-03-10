from __future__ import annotations

from pydantic import BaseModel, Field


class PriorityItem(BaseModel):
    applicationId: str
    startupName: str
    roleTitle: str
    priorityScore: int = Field(ge=0, le=100)
    fitScore: int = Field(ge=0, le=100)
    riskScore: int = Field(ge=0, le=100)
    decayScore: int = Field(ge=0, le=100)
    effectivePriorityScore: int = Field(ge=0, le=100)
    urgencyWindow: str
    whyNowSignals: list[str]
    nextBestAction: str
    whyNow: str


class PrioritiesResponse(BaseModel):
    queue: list[PriorityItem]
    reason: str

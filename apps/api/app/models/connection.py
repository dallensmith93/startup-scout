from __future__ import annotations

from pydantic import BaseModel, Field


class ConnectionItem(BaseModel):
    id: str
    name: str
    role: str = ""
    company: str
    stage: str
    relationshipScore: int = Field(default=0, ge=0, le=100)
    relationshipScoreReason: str = ""
    responseLikelihood: int = Field(default=0, ge=0, le=100)
    responseLikelihoodReason: str = ""
    recommendedTiming: str = ""
    recommendedTimingReason: str = ""
    recommendedNextStep: str = ""
    reason: str


class ConnectionsSummary(BaseModel):
    total: int = Field(default=0, ge=0)
    highLikelihood: int = Field(default=0, ge=0)
    needsAttention: int = Field(default=0, ge=0)
    reason: str = ""


class ConnectionsResponse(BaseModel):
    generatedForDate: str
    summary: ConnectionsSummary | None = None
    items: list[ConnectionItem]
    reason: str

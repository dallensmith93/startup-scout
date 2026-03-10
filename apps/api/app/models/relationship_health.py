from __future__ import annotations

from pydantic import BaseModel, Field


class RelationshipHealthItem(BaseModel):
    contactId: str
    name: str
    company: str
    healthScore: int = Field(ge=0, le=100)
    healthScoreReason: str = ""
    staleRiskScore: int = Field(default=0, ge=0, le=100)
    staleRiskReason: str = ""
    urgency: str
    nextTouchRecommendation: str = ""
    nextTouchReason: str = ""
    reason: str


class RelationshipHealthSummary(BaseModel):
    total: int = Field(default=0, ge=0)
    atRisk: int = Field(default=0, ge=0)
    stable: int = Field(default=0, ge=0)
    strongestContactId: str | None = None
    reason: str = ""


class RelationshipHealthResponse(BaseModel):
    generatedForDate: str
    summary: RelationshipHealthSummary | None = None
    items: list[RelationshipHealthItem]
    reason: str

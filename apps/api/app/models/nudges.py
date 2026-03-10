from __future__ import annotations

from pydantic import BaseModel, Field


class NudgeItem(BaseModel):
    id: str
    category: str
    title: str
    reason: str
    importanceScore: int = Field(ge=0, le=100)
    importanceRank: int = Field(ge=1)
    relatedApplicationId: str | None = None
    action: str


class NudgesResponse(BaseModel):
    generatedForDate: str
    items: list[NudgeItem]
    reason: str

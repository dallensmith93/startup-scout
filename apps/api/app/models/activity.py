from __future__ import annotations

from pydantic import BaseModel


class ActivityItem(BaseModel):
    id: str
    timestamp: str
    type: str
    title: str
    detail: str
    relatedApplicationId: str | None = None


class ActivityFeedResponse(BaseModel):
    generatedForDate: str
    timeline: list[ActivityItem]
    reason: str

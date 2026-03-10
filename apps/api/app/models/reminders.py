from __future__ import annotations

from pydantic import BaseModel, Field


class ReminderItem(BaseModel):
    id: str
    relatedApplicationId: str
    startupName: str
    roleTitle: str
    dueDate: str
    status: str
    daysUntilDue: int
    timingRecommendation: str
    overdueAlert: bool
    importanceScore: int = Field(ge=0, le=100)
    importanceRank: int = Field(ge=1)
    reason: str


class RemindersResponse(BaseModel):
    generatedForDate: str
    reminders: list[ReminderItem]
    overdueAlerts: list[ReminderItem]
    reason: str

from __future__ import annotations

from pydantic import BaseModel, Field


class TaskItem(BaseModel):
    id: str
    title: str
    category: str
    priority: str
    dueDate: str
    linkedApplicationId: str | None = None
    reason: str


class ActionQueueItem(BaseModel):
    id: str
    title: str
    urgency: str
    dueDate: str
    linkedApplicationId: str | None = None
    reason: str


class FollowupItem(BaseModel):
    applicationId: str
    startupName: str
    roleTitle: str
    dueDate: str
    reason: str


class TasksResponse(BaseModel):
    items: list[TaskItem]
    followups: list[FollowupItem]
    actionQueue: list[ActionQueueItem] = Field(default_factory=list)
    reason: str

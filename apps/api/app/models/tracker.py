from __future__ import annotations

from typing import Literal

from pydantic import BaseModel


TrackerStatus = Literal["saved", "tailoring", "applied", "interview", "offer", "rejected"]


class TrackerItem(BaseModel):
    applicationId: str
    startupName: str
    roleTitle: str
    status: TrackerStatus
    stage: str
    note: str = ""
    updatedAt: str
    nextAction: str


class TrackerUpdateRequest(BaseModel):
    applicationId: str
    stage: str
    note: str = ""


class FollowupReminder(BaseModel):
    applicationId: str
    startupName: str
    roleTitle: str
    urgency: Literal["low", "medium", "high"]
    reason: str
    suggestedMessage: str


class TrackerListResponse(BaseModel):
    total: int
    items: list[TrackerItem]


class TrackerUpdateResponse(BaseModel):
    item: TrackerItem


class FollowupListResponse(BaseModel):
    items: list[FollowupReminder]

from __future__ import annotations

from pydantic import BaseModel, Field


class Contact(BaseModel):
    id: str
    name: str
    role: str
    company: str
    stage: str
    relationshipScore: int = Field(ge=0, le=100)
    relationshipScoreReason: str = ""
    lastTouchDays: int = Field(ge=0)
    notes: str
    nextAction: str = ""
    nextActionReason: str = ""


class ContactSummary(BaseModel):
    total: int = Field(default=0, ge=0)
    active: int = Field(default=0, ge=0)
    warm: int = Field(default=0, ge=0)
    new: int = Field(default=0, ge=0)
    needsAttention: int = Field(default=0, ge=0)
    reason: str = ""


class ContactTimelineEntry(BaseModel):
    date: str
    title: str
    detail: str
    reason: str


class ContactMessageEntry(BaseModel):
    date: str
    channel: str
    summary: str
    outcome: str
    reason: str


class ContactDetailResponse(BaseModel):
    contact: Contact
    timeline: list[ContactTimelineEntry]
    messageHistory: list[ContactMessageEntry]
    reason: str


class ContactListResponse(BaseModel):
    generatedForDate: str
    summary: ContactSummary | None = None
    contacts: list[Contact]
    reason: str

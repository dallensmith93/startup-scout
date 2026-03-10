from __future__ import annotations

from pydantic import BaseModel, Field


class EffortAllocationItem(BaseModel):
    category: str
    hours: int
    reason: str


class PlannedAction(BaseModel):
    title: str
    owner: str
    day: str
    reason: str


class WeeklyPlanResponse(BaseModel):
    weekOf: str
    focusTheme: str
    effortAllocation: list[EffortAllocationItem]
    suggestedActions: list[PlannedAction]
    summary: str


class WeeklyReportResponse(BaseModel):
    weekOf: str
    wins: list[str]
    bottlenecks: list[str]
    nextWeekPlan: list[str]
    risks: list[str] = Field(default_factory=list)
    nextSteps: list[str] = Field(default_factory=list)
    confidence: int = Field(ge=0, le=100)
    confidenceReason: str
    reason: str

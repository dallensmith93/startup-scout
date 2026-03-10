from __future__ import annotations

from pydantic import BaseModel, Field


class Preferences(BaseModel):
    enabledCategories: list[str] = Field(default_factory=lambda: ["follow_up", "quick_win", "risk_watch", "momentum"])
    intensity: str = Field(default="medium", pattern="^(low|medium|high)$")
    minImportance: int = Field(default=45, ge=0, le=100)


class PreferencesUpdateRequest(BaseModel):
    enabledCategories: list[str] | None = None
    intensity: str | None = Field(default=None, pattern="^(low|medium|high)$")
    minImportance: int | None = Field(default=None, ge=0, le=100)


class PreferencesResponse(BaseModel):
    preferences: Preferences
    reason: str

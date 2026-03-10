from __future__ import annotations

import json
from pathlib import Path

from app.models.preferences import Preferences, PreferencesUpdateRequest

DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "mock_nudge_state.json"
ALLOWED_CATEGORIES = {"follow_up", "quick_win", "risk_watch", "momentum"}
DEFAULT_PREFERENCES = Preferences()
_PREFERENCES: Preferences | None = None


def _coerce_preferences(payload: object) -> Preferences:
    if isinstance(payload, dict) and "preferences" in payload:
        return Preferences.model_validate(payload["preferences"])
    if isinstance(payload, dict):
        return Preferences.model_validate(payload)
    return DEFAULT_PREFERENCES


def _read_seed_preferences() -> Preferences:
    if not DATA_FILE.exists():
        return DEFAULT_PREFERENCES
    payload = json.loads(DATA_FILE.read_text(encoding="utf-8-sig"))
    return _coerce_preferences(payload)


def get_preferences() -> Preferences:
    global _PREFERENCES
    if _PREFERENCES is None:
        _PREFERENCES = _read_seed_preferences()
    return _PREFERENCES


def update_preferences(update: PreferencesUpdateRequest) -> Preferences:
    global _PREFERENCES

    current = get_preferences()
    payload = current.model_dump()
    if update.enabledCategories is not None:
        payload["enabledCategories"] = [category for category in update.enabledCategories if category in ALLOWED_CATEGORIES]
    if update.intensity is not None:
        payload["intensity"] = update.intensity
    if update.minImportance is not None:
        payload["minImportance"] = update.minImportance
    _PREFERENCES = Preferences.model_validate(payload)
    return _PREFERENCES


def intensity_multiplier(intensity: str) -> float:
    return {"low": 0.85, "medium": 1.0, "high": 1.15}.get(intensity, 1.0)


def adjusted_importance_threshold(preferences: Preferences) -> int:
    if preferences.intensity == "high":
        return max(0, preferences.minImportance - 10)
    if preferences.intensity == "low":
        return min(100, preferences.minImportance + 10)
    return preferences.minImportance

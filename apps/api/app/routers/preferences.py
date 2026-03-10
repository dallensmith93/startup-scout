from __future__ import annotations

from fastapi import APIRouter

from app.models.preferences import PreferencesResponse, PreferencesUpdateRequest
from app.services.preference_manager import get_preferences, update_preferences

router = APIRouter(prefix="/preferences", tags=["preferences"])


@router.get("", response_model=PreferencesResponse)
def preferences() -> PreferencesResponse:
    return PreferencesResponse(
        preferences=get_preferences(),
        reason="Current in-memory nudge preferences control category filtering and intensity scaling.",
    )


@router.put("", response_model=PreferencesResponse)
def set_preferences(payload: PreferencesUpdateRequest) -> PreferencesResponse:
    return PreferencesResponse(
        preferences=update_preferences(payload),
        reason="Preferences updated in memory for subsequent nudge and reminder generation.",
    )

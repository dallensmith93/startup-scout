from __future__ import annotations

from fastapi import APIRouter

from app.models.reminders import RemindersResponse
from app.services.dashboard_aggregator import load_search_state
from app.services.preference_manager import get_preferences
from app.services.reminder_engine import build_reminders

router = APIRouter(prefix="/reminders", tags=["reminders"])


@router.get("", response_model=RemindersResponse)
def reminders() -> RemindersResponse:
    return build_reminders(load_search_state(), get_preferences())

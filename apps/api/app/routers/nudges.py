from __future__ import annotations

from fastapi import APIRouter

from app.models.nudges import NudgesResponse
from app.services.dashboard_aggregator import load_search_state
from app.services.nudge_engine import build_nudges
from app.services.preference_manager import get_preferences

router = APIRouter(prefix="/nudges", tags=["nudges"])


@router.get("", response_model=NudgesResponse)
def nudges() -> NudgesResponse:
    return build_nudges(load_search_state(), get_preferences())

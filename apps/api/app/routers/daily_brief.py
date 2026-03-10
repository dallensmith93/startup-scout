from __future__ import annotations

from fastapi import APIRouter

from app.models.daily_brief import DailyBriefResponse
from app.services.daily_brief_builder import build_daily_brief
from app.services.dashboard_aggregator import load_search_state

router = APIRouter(prefix="/daily-brief", tags=["daily-brief"])


@router.get("", response_model=DailyBriefResponse)
def daily_brief() -> DailyBriefResponse:
    return build_daily_brief(load_search_state())

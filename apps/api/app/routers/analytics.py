from __future__ import annotations

from fastapi import APIRouter

from app.models.analytics import AnalyticsResponse
from app.services.dashboard_aggregator import load_search_state
from app.services.search_analytics import compute_analytics

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("", response_model=AnalyticsResponse)
def analytics() -> AnalyticsResponse:
    return compute_analytics(load_search_state())

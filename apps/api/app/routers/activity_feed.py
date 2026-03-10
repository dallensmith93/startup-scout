from __future__ import annotations

from fastapi import APIRouter

from app.models.activity import ActivityFeedResponse
from app.services.activity_feed_builder import build_activity_feed
from app.services.dashboard_aggregator import load_search_state

router = APIRouter(prefix="/activity-feed", tags=["activity-feed"])


@router.get("", response_model=ActivityFeedResponse)
def activity_feed() -> ActivityFeedResponse:
    return build_activity_feed(load_search_state())

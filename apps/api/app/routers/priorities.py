from __future__ import annotations

from fastapi import APIRouter

from app.models.priorities import PrioritiesResponse
from app.services.dashboard_aggregator import load_search_state
from app.services.opportunity_prioritizer import prioritize_opportunities

router = APIRouter(prefix="/priorities", tags=["priorities"])


@router.get("", response_model=PrioritiesResponse)
def priorities() -> PrioritiesResponse:
    return prioritize_opportunities(load_search_state())

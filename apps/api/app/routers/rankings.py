from __future__ import annotations

from fastapi import APIRouter

from app.models import RankingItem
from app.services.startup_analyzer import analyze_all_startups

router = APIRouter(prefix="/rankings", tags=["rankings"])


@router.get("", response_model=list[RankingItem])
def get_rankings() -> list[RankingItem]:
    ordered = sorted(analyze_all_startups(), key=lambda x: x.score, reverse=True)
    return [RankingItem(rank=idx + 1, **item.model_dump()) for idx, item in enumerate(ordered)]

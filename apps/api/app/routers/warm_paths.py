from __future__ import annotations

from fastapi import APIRouter

from app.models.outreach import WarmPathsResponse
from app.services.warm_path_finder import find_warm_paths

router = APIRouter(prefix="/warm-paths", tags=["warm-paths"])


@router.get("", response_model=WarmPathsResponse)
def warm_paths() -> WarmPathsResponse:
    return find_warm_paths()

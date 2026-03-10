from __future__ import annotations

from fastapi import APIRouter

from app.models.dashboard import DashboardResponse
from app.services.dashboard_aggregator import build_dashboard

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardResponse)
def get_dashboard() -> DashboardResponse:
    return build_dashboard()

from __future__ import annotations

from fastapi import APIRouter

from app.models.planner import WeeklyPlanResponse, WeeklyReportResponse
from app.services.dashboard_aggregator import load_search_state
from app.services.weekly_planner import generate_weekly_plan
from app.services.weekly_report_builder import build_weekly_report

router = APIRouter(prefix="/planner", tags=["planner"])


@router.get("/weekly", response_model=WeeklyPlanResponse)
def weekly_plan() -> WeeklyPlanResponse:
    return generate_weekly_plan(load_search_state())


@router.get("/weekly-report", response_model=WeeklyReportResponse)
def weekly_report() -> WeeklyReportResponse:
    return build_weekly_report(load_search_state())

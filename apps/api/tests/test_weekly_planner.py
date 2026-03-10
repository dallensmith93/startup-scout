from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.weekly_planner import generate_weekly_plan
from app.services.weekly_report_builder import build_weekly_report
from app.services.dashboard_aggregator import load_search_state


def test_weekly_planner_has_actions_and_reasons() -> None:
    plan = generate_weekly_plan(load_search_state())
    assert plan.focusTheme
    assert len(plan.effortAllocation) >= 3
    assert all(item.reason for item in plan.effortAllocation)
    assert len(plan.suggestedActions) >= 3


def test_weekly_planner_contains_outreach_allocation_block() -> None:
    plan = generate_weekly_plan(load_search_state())
    outreach = next(item for item in plan.effortAllocation if item.category == "Outreach")
    assert outreach.hours >= 1
    assert outreach.reason


def test_weekly_report_includes_confidence_risks_and_next_steps_sections() -> None:
    report = build_weekly_report(load_search_state())

    assert report.wins
    assert report.bottlenecks
    assert report.nextWeekPlan
    assert all(isinstance(item, str) and item for item in report.nextWeekPlan)

from __future__ import annotations

from app.models.planner import PlannedAction, WeeklyPlanResponse
from app.services.bottleneck_detector import detect_bottlenecks
from app.services.effort_allocator import allocate_effort
from app.services.momentum_analyzer import compute_weekly_focus_score


def generate_weekly_plan(state: dict) -> WeeklyPlanResponse:
    bottlenecks = detect_bottlenecks(state)
    allocation = allocate_effort(state, bottlenecks)
    weekly_focus = compute_weekly_focus_score(state)

    actions = [
        PlannedAction(title="Submit two high-priority applications", owner="You", day="Tuesday", reason="Maintain steady application throughput."),
        PlannedAction(title="Run follow-up block", owner="You", day="Wednesday", reason="Reduce follow-up stage stagnation and decay risk."),
        PlannedAction(title="Refresh outreach messaging", owner="You", day="Thursday", reason="Improve response conversion quality."),
        PlannedAction(title="Weekly review and replanning", owner="You", day="Friday", reason="Close loop on wins, bottlenecks, and next actions."),
    ]

    return WeeklyPlanResponse(
        weekOf=state["weekOf"],
        focusTheme=f"Quality-adjusted pipeline acceleration (focus score: {weekly_focus})",
        effortAllocation=allocation,
        suggestedActions=actions,
        summary="Plan balances throughput, follow-up discipline, and conversion improvements.",
    )

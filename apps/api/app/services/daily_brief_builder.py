from __future__ import annotations

from datetime import date

from app.models.daily_brief import DailyBriefResponse, FollowupDueItem, PriorityBriefItem
from app.services.quick_win_detector import detect_quick_wins
from app.services.risk_watch_builder import build_risk_watch


def _effective_priority(app: dict, reference_date: date) -> int:
    due_date = date.fromisoformat(app["dueDate"])
    days_until_due = (due_date - reference_date).days
    urgency_boost = max(0, 4 - max(0, days_until_due)) * 4
    return min(100, max(0, round(app["priorityScore"] * 0.6 + app["fitScore"] * 0.25 + urgency_boost - app["riskScore"] * 0.1)))


def build_daily_brief(state: dict) -> DailyBriefResponse:
    reference_date = date.fromisoformat(state["weekOf"])
    sorted_apps = sorted(state["applications"], key=lambda app: _effective_priority(app, reference_date), reverse=True)

    top_priorities = [
        PriorityBriefItem(
            applicationId=app["id"],
            startupName=app["startupName"],
            roleTitle=app["roleTitle"],
            priorityScore=_effective_priority(app, reference_date),
            reason=(
                f"Selected from fit {app['fitScore']}, priority {app['priorityScore']}, risk {app['riskScore']}, "
                f"and due-date urgency."
            ),
        )
        for app in sorted_apps[:3]
    ]

    followups_due: list[FollowupDueItem] = []
    for app in state["applications"]:
        due_date = date.fromisoformat(app["dueDate"])
        days_until_due = (due_date - reference_date).days
        if app["stage"] != "follow-up" and days_until_due > 1:
            continue
        followups_due.append(
            FollowupDueItem(
                applicationId=app["id"],
                startupName=app["startupName"],
                roleTitle=app["roleTitle"],
                dueDate=app["dueDate"],
                daysUntilDue=days_until_due,
                reason=f"Follow-up is due in {days_until_due} day(s) for stage {app['stage']}.",
            )
        )

    followups_due.sort(key=lambda item: item.daysUntilDue)
    return DailyBriefResponse(
        generatedForDate=state["weekOf"],
        topPriorities=top_priorities,
        followupsDue=followups_due[:4],
        quickWins=detect_quick_wins(state),
        riskWatch=build_risk_watch(state),
        reason="Daily brief combines top priorities, follow-up pressure, quick wins, and risk watch in a deterministic snapshot.",
    )

from __future__ import annotations

from datetime import datetime

from app.models.tasks import FollowupItem


def _days_until_due(week_of: str, due_date: str) -> int:
    ref_date = datetime.strptime(week_of, "%Y-%m-%d").date()
    due = datetime.strptime(due_date, "%Y-%m-%d").date()
    return (due - ref_date).days


def build_followup_schedule(state: dict) -> list[FollowupItem]:
    followups: list[FollowupItem] = []
    for app in state["applications"]:
        if app["stage"] != "follow-up":
            continue
        days_to_due = _days_until_due(state["weekOf"], app["dueDate"])
        timing = "overdue" if days_to_due < 0 else f"due in {days_to_due} day(s)"
        followups.append(
            FollowupItem(
                applicationId=app["id"],
                startupName=app["startupName"],
                roleTitle=app["roleTitle"],
                dueDate=app["dueDate"],
                reason=f"Follow-up stage item is {timing}; immediate touchpoint prevents drop-off.",
            )
        )
    return sorted(followups, key=lambda x: x.dueDate)

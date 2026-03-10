from __future__ import annotations

from datetime import date

from app.models.preferences import Preferences
from app.models.reminders import ReminderItem, RemindersResponse
from app.services.alert_priority_ranker import rank_with_importance
from app.services.timing_recommender import recommend_timing


def _compute_importance_score(app: dict, days_until_due: int) -> int:
    overdue_boost = max(0, -days_until_due) * 12
    due_pressure = max(0, 3 - max(0, days_until_due)) * 6
    stage_boost = 12 if app["stage"] == "follow-up" else 0
    return min(100, max(0, round(app["priorityScore"] * 0.45 + app["fitScore"] * 0.2 + overdue_boost + due_pressure + stage_boost)))


def build_reminders(state: dict, preferences: Preferences) -> RemindersResponse:
    reference_date = date.fromisoformat(state["weekOf"])
    candidate_items: list[dict] = []

    for app in state["applications"]:
        due_date = date.fromisoformat(app["dueDate"])
        days_until_due = (due_date - reference_date).days
        if days_until_due > 2 and app["stage"] != "follow-up":
            continue

        status = "overdue" if days_until_due < 0 else ("due_today" if days_until_due == 0 else "upcoming")
        importance_score = _compute_importance_score(app, days_until_due)
        candidate_items.append(
            {
                "id": f"reminder-{app['id']}",
                "relatedApplicationId": app["id"],
                "startupName": app["startupName"],
                "roleTitle": app["roleTitle"],
                "dueDate": app["dueDate"],
                "status": status,
                "daysUntilDue": days_until_due,
                "timingRecommendation": recommend_timing(days_until_due, app["stage"], preferences.intensity),
                "overdueAlert": status == "overdue",
                "importanceScore": importance_score,
                "reason": (
                    f"Reminder triggered by due date {app['dueDate']} with stage {app['stage']} "
                    f"and priority score {app['priorityScore']}."
                ),
            }
        )

    ranked = rank_with_importance(candidate_items)
    reminders = [ReminderItem.model_validate(item) for item in ranked]
    overdue_alerts = [item for item in reminders if item.overdueAlert]
    return RemindersResponse(
        generatedForDate=state["weekOf"],
        reminders=reminders,
        overdueAlerts=overdue_alerts,
        reason="Reminders are ranked by urgency, due-date pressure, and stage-aware importance scoring.",
    )

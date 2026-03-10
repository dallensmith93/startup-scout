from __future__ import annotations

from datetime import date

from app.models.daily_brief import QuickWinItem


def detect_quick_wins(state: dict) -> list[QuickWinItem]:
    reference_date = date.fromisoformat(state["weekOf"])
    candidates: list[tuple[int, QuickWinItem]] = []

    for app in state["applications"]:
        due_date = date.fromisoformat(app["dueDate"])
        days_until_due = (due_date - reference_date).days
        if app["status"] not in {"saved", "tailoring", "applied"}:
            continue
        if days_until_due < -1:
            continue

        impact_score = min(
            100,
            max(0, round(app["fitScore"] * 0.55 + app["priorityScore"] * 0.35 + max(0, 7 - days_until_due) * 2 - app["riskScore"] * 0.15)),
        )
        if impact_score < 55:
            continue

        candidates.append(
            (
                impact_score,
                QuickWinItem(
                    applicationId=app["id"],
                    startupName=app["startupName"],
                    roleTitle=app["roleTitle"],
                    impactScore=impact_score,
                    reason=(
                        f"High near-term upside from fit {app['fitScore']} and priority {app['priorityScore']} "
                        f"with due date pressure in {days_until_due} days."
                    ),
                    recommendedAction="Finalize and send a targeted touchpoint today.",
                ),
            )
        )

    candidates.sort(key=lambda item: item[0], reverse=True)
    return [item for _, item in candidates[:3]]

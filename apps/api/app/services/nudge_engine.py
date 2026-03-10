from __future__ import annotations

from app.models.nudges import NudgeItem, NudgesResponse
from app.models.preferences import Preferences
from app.services.alert_priority_ranker import rank_with_importance
from app.services.preference_manager import adjusted_importance_threshold, intensity_multiplier
from app.services.quick_win_detector import detect_quick_wins
from app.services.reminder_engine import build_reminders
from app.services.risk_watch_builder import build_risk_watch


def _build_raw_nudges(state: dict, preferences: Preferences) -> list[dict]:
    nudges: list[dict] = []
    reminders = build_reminders(state, preferences)
    quick_wins = detect_quick_wins(state)
    risk_watch = build_risk_watch(state)

    for reminder in reminders.overdueAlerts:
        nudges.append(
            {
                "id": f"nudge-{reminder.relatedApplicationId}-overdue",
                "category": "follow_up",
                "title": f"Overdue follow-up: {reminder.startupName}",
                "reason": f"Item is overdue by {-reminder.daysUntilDue} day(s). {reminder.reason}",
                "importanceScore": min(100, reminder.importanceScore + 8),
                "relatedApplicationId": reminder.relatedApplicationId,
                "action": "Send a follow-up update immediately.",
            }
        )

    for item in quick_wins:
        nudges.append(
            {
                "id": f"nudge-{item.applicationId}-quick-win",
                "category": "quick_win",
                "title": f"Quick win: {item.startupName}",
                "reason": item.reason,
                "importanceScore": item.impactScore,
                "relatedApplicationId": item.applicationId,
                "action": item.recommendedAction,
            }
        )

    for item in risk_watch:
        nudges.append(
            {
                "id": f"nudge-{item.applicationId}-risk-watch",
                "category": "risk_watch",
                "title": f"Risk watch: {item.startupName}",
                "reason": item.reason,
                "importanceScore": item.riskScore,
                "relatedApplicationId": item.applicationId,
                "action": item.recommendedAction,
            }
        )

    total_sent = sum(entry["sent"] for entry in state.get("outreach", []))
    target = state.get("targetOutreachPerWeek", 0)
    if total_sent < target:
        gap = target - total_sent
        nudges.append(
            {
                "id": "nudge-outreach-momentum",
                "category": "momentum",
                "title": "Outreach momentum below weekly target",
                "reason": f"You are {gap} outreach messages below weekly target ({total_sent}/{target}).",
                "importanceScore": min(100, 45 + gap * 4),
                "action": "Schedule one focused outreach block to recover weekly pace.",
            }
        )

    return nudges


def build_nudges(state: dict, preferences: Preferences) -> NudgesResponse:
    raw_nudges = _build_raw_nudges(state, preferences)
    threshold = adjusted_importance_threshold(preferences)
    multiplier = intensity_multiplier(preferences.intensity)

    filtered: list[dict] = []
    for item in raw_nudges:
        if item["category"] not in preferences.enabledCategories:
            continue
        adjusted_score = min(100, max(0, round(item["importanceScore"] * multiplier)))
        if adjusted_score < threshold:
            continue
        merged = dict(item)
        merged["importanceScore"] = adjusted_score
        filtered.append(merged)

    ranked = rank_with_importance(filtered)
    items = [NudgeItem.model_validate(item) for item in ranked]
    return NudgesResponse(
        generatedForDate=state["weekOf"],
        items=items,
        reason="Nudges are deterministic from reminder urgency, quick wins, risk watch, and preference-controlled intensity/filtering.",
    )

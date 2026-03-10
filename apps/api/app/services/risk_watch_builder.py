from __future__ import annotations

from datetime import date

from app.models.daily_brief import RiskWatchItem


def _severity_for_score(score: int) -> str:
    if score >= 80:
        return "high"
    if score >= 65:
        return "medium"
    return "low"


def build_risk_watch(state: dict) -> list[RiskWatchItem]:
    reference_date = date.fromisoformat(state["weekOf"])
    items: list[tuple[int, RiskWatchItem]] = []

    for app in state["applications"]:
        last_touch = date.fromisoformat(app["lastTouchAt"])
        stale_days = (reference_date - last_touch).days
        risk_score = min(100, max(0, round(app["riskScore"] + stale_days * 2)))
        if risk_score < 62:
            continue

        items.append(
            (
                risk_score,
                RiskWatchItem(
                    applicationId=app["id"],
                    startupName=app["startupName"],
                    roleTitle=app["roleTitle"],
                    riskScore=risk_score,
                    severity=_severity_for_score(risk_score),
                    reason=(
                        f"Risk increased from baseline {app['riskScore']} to {risk_score} "
                        f"because the last touchpoint was {stale_days} days ago."
                    ),
                    recommendedAction="Send a concise status-check message and log next step within 24h.",
                ),
            )
        )

    items.sort(key=lambda item: item[0], reverse=True)
    return [item for _, item in items[:3]]

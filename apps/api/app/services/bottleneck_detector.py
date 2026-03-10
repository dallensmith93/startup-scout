from __future__ import annotations

from app.services.momentum_analyzer import compute_opportunity_decay


def detect_bottleneck_insights(state: dict) -> list[dict[str, object]]:
    apps = state["applications"]
    outreach = state["outreach"]

    insights: list[dict[str, object]] = []

    pending_followups = len([a for a in apps if a["stage"] == "follow-up"])
    if pending_followups >= 2:
        insights.append(
            {
                "code": "followup_backlog",
                "severity": "high" if pending_followups >= 3 else "medium",
                "metric": "pending_followups",
                "value": pending_followups,
                "target": state["targetFollowupsPerWeek"],
                "reason": (
                    f"{pending_followups} opportunities are waiting for follow-up, creating avoidable decay risk."
                ),
                "recommendedAction": "Book a 60-minute follow-up block and clear all overdue items.",
            }
        )

    low_fit = len([a for a in apps if a["fitScore"] < 70])
    if low_fit >= 2:
        insights.append(
            {
                "code": "fit_quality",
                "severity": "medium",
                "metric": "low_fit_roles",
                "value": low_fit,
                "target": 1,
                "reason": f"{low_fit} roles have fit score below 70, reducing expected conversion quality.",
                "recommendedAction": "Narrow role filter and allocate more tailoring to strongest-fit roles.",
            }
        )

    total_sent = sum(day["sent"] for day in outreach)
    total_responses = sum(day["responses"] for day in outreach)
    response_rate = 0.0 if total_sent == 0 else (total_responses / total_sent)
    if total_sent >= 5 and response_rate < 0.2:
        insights.append(
            {
                "code": "outreach_conversion",
                "severity": "high" if response_rate < 0.12 else "medium",
                "metric": "outreach_response_rate",
                "value": round(response_rate * 100),
                "target": 20,
                "reason": (
                    f"Outreach response rate is {round(response_rate * 100)}%, below the 20% operating baseline."
                ),
                "recommendedAction": "Improve message personalization and prioritize referral channels.",
            }
        )

    decay_items = compute_opportunity_decay(state)
    critical_decay = len([item for item in decay_items if item["urgency"] == "critical"])
    if critical_decay >= 1:
        insights.append(
            {
                "code": "opportunity_decay",
                "severity": "high",
                "metric": "critical_decay_items",
                "value": critical_decay,
                "target": 0,
                "reason": f"{critical_decay} opportunities are in critical decay and need immediate contact.",
                "recommendedAction": "Send same-day touchpoints for top decaying opportunities.",
            }
        )

    if not insights:
        insights.append(
            {
                "code": "healthy",
                "severity": "low",
                "metric": "pipeline_health",
                "value": 1,
                "target": 1,
                "reason": "No critical bottlenecks detected; execution cadence is healthy.",
                "recommendedAction": "Maintain current rhythm and keep weekly review in place.",
            }
        )

    severity_rank = {"high": 0, "medium": 1, "low": 2}
    return sorted(insights, key=lambda item: severity_rank.get(str(item["severity"]), 3))


def detect_bottlenecks(state: dict) -> list[str]:
    return [insight["reason"] for insight in detect_bottleneck_insights(state)]

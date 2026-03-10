from __future__ import annotations

from datetime import date, datetime


def _as_date(value: str) -> date:
    return datetime.strptime(value, "%Y-%m-%d").date()


def _reference_date(state: dict) -> date:
    return _as_date(state["weekOf"])


def _days_since_touch(app: dict, ref_date: date) -> int:
    return max(0, (ref_date - _as_date(app["lastTouchAt"])) .days)


def _days_to_due(app: dict, ref_date: date) -> int:
    return (_as_date(app["dueDate"]) - ref_date).days


def _decay_score(app: dict, ref_date: date) -> tuple[int, int, int]:
    days_since_touch = _days_since_touch(app, ref_date)
    days_to_due = _days_to_due(app, ref_date)
    overdue_days = max(0, -days_to_due)
    stage_weight = {"application": 8, "follow-up": 20, "screening": 14, "interview": 10}.get(app["stage"], 10)
    fit_penalty = max(0, 70 - app["fitScore"])
    score = min(100, stage_weight + days_since_touch * 7 + overdue_days * 10 + round(fit_penalty * 0.8))
    return score, days_since_touch, days_to_due


def _decay_urgency(decay_score: int, days_to_due: int) -> str:
    if decay_score >= 80 or days_to_due <= -2:
        return "critical"
    if decay_score >= 60 or days_to_due <= 0:
        return "high"
    if decay_score >= 35:
        return "medium"
    return "low"


def compute_opportunity_decay(state: dict) -> list[dict[str, object]]:
    ref_date = _reference_date(state)
    items: list[dict[str, object]] = []

    for app in state["applications"]:
        decay_score, days_since_touch, days_to_due = _decay_score(app, ref_date)
        urgency = _decay_urgency(decay_score, days_to_due)
        due_status = "overdue" if days_to_due < 0 else "due soon"
        items.append(
            {
                "applicationId": app["id"],
                "startupName": app["startupName"],
                "roleTitle": app["roleTitle"],
                "daysSinceLastTouch": days_since_touch,
                "daysToDue": days_to_due,
                "decayScore": decay_score,
                "urgency": urgency,
                "timeWindow": "24h" if urgency == "critical" else "48h" if urgency == "high" else "72h",
                "nextAction": (
                    "Send a same-day follow-up with one concrete proof of role fit."
                    if urgency in {"critical", "high"}
                    else "Queue a targeted touchpoint before the role cools."
                ),
                "reason": (
                    f"{days_since_touch} days since last touchpoint and role is {due_status} "
                    f"({days_to_due} days)."
                ),
            }
        )

    return sorted(items, key=lambda item: (item["decayScore"], -item["daysToDue"]), reverse=True)


def compute_weekly_focus_score(state: dict) -> int:
    apps = state["applications"]
    outreach = state["outreach"]
    ref_date = _reference_date(state)

    target_apps = max(1, state["targetApplicationsPerWeek"])
    target_outreach = max(1, state["targetOutreachPerWeek"])
    target_followups = max(1, state["targetFollowupsPerWeek"])

    applied_or_better = len([a for a in apps if a["status"] in {"applied", "interview", "offer"}])
    pending_followups = len([a for a in apps if a["stage"] == "follow-up"])
    outreach_sent = sum(day["sent"] for day in outreach)

    response_count = len([a for a in apps if a["responseReceived"]])
    response_rate = 0.0 if len(apps) == 0 else response_count / len(apps)

    stale_count = len([a for a in apps if _days_since_touch(a, ref_date) >= 7])

    application_progress = min(1.0, applied_or_better / target_apps)
    followup_control = max(0.0, 1.0 - (pending_followups / target_followups))
    outreach_progress = min(1.0, outreach_sent / target_outreach)
    stale_penalty = min(0.25, stale_count * 0.05)

    weighted_score = (
        application_progress * 0.45
        + followup_control * 0.25
        + outreach_progress * 0.20
        + response_rate * 0.10
        - stale_penalty
    )
    return max(0, min(100, round(weighted_score * 100)))


def compute_momentum_score(state: dict) -> int:
    apps = state["applications"]
    outreach = state["outreach"]

    responses = len([a for a in apps if a["responseReceived"]])
    interviews = len([a for a in apps if a["interviewScheduled"]])
    active = len([a for a in apps if a["status"] in {"saved", "tailoring", "applied", "interview"}])

    sent = sum(day["sent"] for day in outreach)
    replied = sum(day["responses"] for day in outreach)

    rate = 0 if sent == 0 else round((replied / sent) * 100)
    score = 35 + responses * 8 + interviews * 12 + min(20, active * 2) + round(rate * 0.2)
    return max(0, min(100, score))

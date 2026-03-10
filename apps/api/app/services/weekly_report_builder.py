from __future__ import annotations

from app.models.planner import WeeklyReportResponse
from app.services.bottleneck_detector import detect_bottleneck_insights
from app.services.momentum_analyzer import compute_opportunity_decay, compute_weekly_focus_score


def build_weekly_report(state: dict) -> WeeklyReportResponse:
    apps = state["applications"]

    interview_count = len([a for a in apps if a["interviewScheduled"]])
    response_count = len([a for a in apps if a["responseReceived"]])
    wins = [
        f"{interview_count} interview-stage opportunities remained active this week.",
        f"{response_count} opportunities received responses this cycle.",
        f"{len([a for a in apps if a['status'] in {'applied', 'interview', 'offer'}])} roles progressed beyond tailoring.",
    ]

    bottleneck_insights = detect_bottleneck_insights(state)
    risks = [
        f"{insight['reason']} Next move: {insight['recommendedAction']}"
        for insight in bottleneck_insights
        if insight["severity"] in {"high", "medium"}
    ]
    if not risks:
        risks = ["No major execution risks detected this week."]

    decay_items = compute_opportunity_decay(state)
    highest_decay = decay_items[0] if decay_items else None

    next_steps = [
        "Prioritize top 3 opportunities by effective score and due date.",
        "Complete all due follow-ups within 48 hours.",
        "Run one outreach iteration focused on personalization quality.",
    ]
    if highest_decay:
        next_steps.insert(
            0,
            f"Stabilize {highest_decay['startupName']} immediately; decay score is {highest_decay['decayScore']}.",
        )

    weekly_focus = compute_weekly_focus_score(state)
    high_risks = len([i for i in bottleneck_insights if i["severity"] == "high"])
    confidence = max(0, min(100, weekly_focus + interview_count * 6 - high_risks * 10))
    confidence_reason = (
        f"Confidence starts from weekly focus score {weekly_focus}, then adjusts for {interview_count} active interviews "
        f"and {high_risks} high-severity risks."
    )

    return WeeklyReportResponse(
        weekOf=state["weekOf"],
        wins=wins,
        bottlenecks=risks,
        nextWeekPlan=next_steps,
        risks=risks,
        nextSteps=next_steps,
        confidence=confidence,
        confidenceReason=confidence_reason,
        reason="Weekly report is synthesized from deterministic stage progression, bottlenecks, decay, and confidence scoring.",
    )

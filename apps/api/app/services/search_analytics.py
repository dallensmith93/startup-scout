from __future__ import annotations

from app.models.analytics import AnalyticsResponse, FunnelMetrics, OutreachPerformanceInsight
from app.services.momentum_analyzer import compute_momentum_score


def _response_rate(sent: int, responses: int) -> int:
    return 0 if sent == 0 else round((responses / sent) * 100)


def _build_outreach_insights(state: dict) -> list[OutreachPerformanceInsight]:
    apps = state["applications"]
    outreach = state["outreach"]

    channel_rows: dict[str, dict[str, int]] = {}
    for app in apps:
        channel = app["channel"]
        row = channel_rows.setdefault(channel, {"total": 0, "responses": 0, "interviews": 0})
        row["total"] += 1
        row["responses"] += 1 if app["responseReceived"] else 0
        row["interviews"] += 1 if app["interviewScheduled"] else 0

    insights: list[OutreachPerformanceInsight] = []
    for channel, row in sorted(channel_rows.items()):
        channel_response_rate = 0 if row["total"] == 0 else round((row["responses"] / row["total"]) * 100)
        urgency = "high" if channel_response_rate < 20 else "medium" if channel_response_rate < 35 else "low"
        insights.append(
            OutreachPerformanceInsight(
                title=f"{channel.title()} response rate",
                value=f"{channel_response_rate}%",
                urgency=urgency,
                reason=(
                    f"{row['responses']} of {row['total']} opportunities on {channel} produced responses; "
                    f"interviews booked: {row['interviews']}."
                ),
            )
        )

    recent = outreach[-3:]
    previous = outreach[-6:-3]
    recent_sent = sum(day["sent"] for day in recent)
    recent_resp = sum(day["responses"] for day in recent)
    prev_sent = sum(day["sent"] for day in previous)
    prev_resp = sum(day["responses"] for day in previous)

    recent_rate = _response_rate(recent_sent, recent_resp)
    previous_rate = _response_rate(prev_sent, prev_resp)
    delta = recent_rate - previous_rate
    trend = "up" if delta > 0 else "down" if delta < 0 else "flat"
    insights.append(
        OutreachPerformanceInsight(
            title="Weekly outreach trend",
            value=f"{trend} ({delta:+} pp)",
            urgency="high" if delta < 0 else "low",
            reason=f"Recent 3-day response rate is {recent_rate}% versus {previous_rate}% in the prior window.",
        )
    )

    return insights


def compute_analytics(state: dict) -> AnalyticsResponse:
    apps = state["applications"]
    total = len(apps)
    responses = len([a for a in apps if a["responseReceived"]])
    interviews = len([a for a in apps if a["interviewScheduled"]])

    response_rate = 0 if total == 0 else round((responses / total) * 100)
    interview_rate = 0 if total == 0 else round((interviews / total) * 100)

    funnel = FunnelMetrics(
        saved=len([a for a in apps if a["status"] == "saved"]),
        tailoring=len([a for a in apps if a["status"] == "tailoring"]),
        applied=len([a for a in apps if a["status"] == "applied"]),
        interview=len([a for a in apps if a["status"] == "interview"]),
        offer=len([a for a in apps if a["status"] == "offer"]),
        rejected=len([a for a in apps if a["status"] == "rejected"]),
    )

    outreach_sent = sum(day["sent"] for day in state["outreach"])
    outreach_responses = sum(day["responses"] for day in state["outreach"])

    return AnalyticsResponse(
        applicationsTotal=total,
        responseRate=response_rate,
        interviewRate=interview_rate,
        momentumScore=compute_momentum_score(state),
        funnel=funnel,
        outreachSent=outreach_sent,
        outreachResponses=outreach_responses,
        outreachPerformanceInsights=_build_outreach_insights(state),
        reason="Analytics are computed from deterministic conversion rates, funnel stage counts, and outreach patterns.",
    )

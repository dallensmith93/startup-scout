from __future__ import annotations

import json
from pathlib import Path

from app.models.dashboard import (
    ActionQueueSummary,
    ActionQueuePreviewItem,
    DashboardResponse,
    OpportunityDecayItem,
    OpportunityHighlight,
    PipelineSnapshotItem,
    RiskAlert,
    StuckInsight,
    SummaryMetric,
)
from app.services.bottleneck_detector import detect_bottleneck_insights
from app.services.momentum_analyzer import compute_momentum_score, compute_opportunity_decay, compute_weekly_focus_score
from app.services.task_generator import generate_tasks

DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "mock_search_state.json"


def load_search_state() -> dict:
    return json.loads(DATA_FILE.read_text(encoding="utf-8-sig"))


def build_dashboard() -> DashboardResponse:
    state = load_search_state()
    apps = state["applications"]

    applied = [a for a in apps if a["status"] in {"applied", "interview", "offer"}]
    responses = [a for a in apps if a["responseReceived"]]
    interviews = [a for a in apps if a["interviewScheduled"]]

    metrics = [
        SummaryMetric(
            label="Applications",
            value=len(applied),
            target=state["targetApplicationsPerWeek"],
            reason="Tracks throughput into the pipeline's active stages.",
        ),
        SummaryMetric(
            label="Follow-ups",
            value=len([a for a in apps if a["stage"] == "follow-up"]),
            target=state["targetFollowupsPerWeek"],
            reason="Consistent follow-up cadence compounds interview probability.",
        ),
        SummaryMetric(
            label="Responses",
            value=len(responses),
            target=max(1, round(state["targetApplicationsPerWeek"] * 0.4)),
            reason="Response count is an early health signal for positioning quality.",
        ),
        SummaryMetric(
            label="Interviews",
            value=len(interviews),
            target=max(1, round(state["targetApplicationsPerWeek"] * 0.2)),
            reason="Interview progression confirms strong role-to-candidate alignment.",
        ),
    ]

    stages = ["saved", "tailoring", "applied", "interview", "offer", "rejected"]
    pipeline = [PipelineSnapshotItem(stage=s, count=len([a for a in apps if a["status"] == s])) for s in stages]

    top = sorted(apps, key=lambda x: x["priorityScore"], reverse=True)[:3]
    top_items = [
        OpportunityHighlight(
            applicationId=item["id"],
            startupName=item["startupName"],
            roleTitle=item["roleTitle"],
            score=item["priorityScore"],
            reason=f"High priority due to fit {item['fitScore']} and manageable risk {item['riskScore']}.",
        )
        for item in top
    ]

    risk_alerts = [
        RiskAlert(
            applicationId=item["id"],
            headline=f"{item['startupName']}: rising staleness risk",
            severity="medium" if item["riskScore"] < 60 else "high",
            reason="No recent touchpoint combined with elevated risk profile.",
        )
        for item in apps
        if item["riskScore"] >= 55 or item["stage"] == "follow-up"
    ][:3]

    decay_items = [OpportunityDecayItem(**item) for item in compute_opportunity_decay(state)]
    bottleneck_insights = detect_bottleneck_insights(state)
    why_stuck = bottleneck_insights[0]["reason"] if bottleneck_insights else "No active bottlenecks detected."

    tasks = generate_tasks(state)
    critical_count = len([item for item in tasks.actionQueue if item.urgency == "critical"])
    high_count = len([item for item in tasks.actionQueue if item.urgency == "high"])
    top_reason = tasks.actionQueue[0].reason if tasks.actionQueue else "No immediate actions pending."
    action_queue_preview = [
        ActionQueuePreviewItem(
            id=item.id,
            title=item.title,
            actionType="follow_up" if "follow" in item.title.lower() else "apply",
            priority="high" if item.urgency in {"critical", "high"} else "medium",
            etaMinutes=15 if item.urgency == "critical" else 25,
            reason=item.reason,
        )
        for item in tasks.actionQueue[:4]
    ]
    focus_score = compute_weekly_focus_score(state)
    focus_target = 80
    focus_gap = max(0, focus_target - focus_score)
    focus_reason = (
        "On-target focus profile. Keep follow-up and high-score application cadence stable."
        if focus_gap == 0
        else f"{focus_gap} point gap driven by follow-up backlog and conversion friction."
    )

    momentum = compute_momentum_score(state)
    return DashboardResponse(
        momentumScore=momentum,
        weeklyFocusScore=focus_score,
        weeklyFocusTarget=focus_target,
        weeklyFocusReason=focus_reason,
        summaryMetrics=metrics,
        pipelineSnapshot=pipeline,
        topOpportunities=top_items,
        riskAlerts=risk_alerts,
        opportunityDecay=decay_items,
        stuckInsight=StuckInsight(
            headline="Pipeline is active but conversion is bottlenecked.",
            cause=str(why_stuck),
            evidence=[
                f"{len([a for a in apps if a['stage'] == 'follow-up'])} items are waiting in follow-up stage.",
                f"{len([a for a in apps if a['responseReceived']])} of {len(apps)} opportunities have responded.",
                f"{len([a for a in apps if a['interviewScheduled']])} opportunities reached interview stage.",
            ],
            unblockActions=[
                "Run a same-day follow-up sprint for all high-decay roles.",
                "Prioritize top 3 decay-aware opportunities before new sourcing.",
                "Refine outreach message quality for low-response channels.",
            ],
        ),
        whyStuck=str(why_stuck),
        actionQueuePreview=action_queue_preview,
        actionQueue=ActionQueueSummary(total=len(tasks.actionQueue), critical=critical_count, high=high_count, topReason=top_reason),
        reason="Dashboard is a deterministic aggregation of pipeline, outreach, bottlenecks, and execution urgency.",
    )

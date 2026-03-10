from __future__ import annotations

from app.models.tasks import ActionQueueItem, TaskItem, TasksResponse
from app.services.bottleneck_detector import detect_bottleneck_insights
from app.services.followup_scheduler import build_followup_schedule
from app.services.momentum_analyzer import compute_opportunity_decay


def _urgency_rank(value: str) -> int:
    return {"critical": 0, "high": 1, "medium": 2, "low": 3}.get(value, 4)


def _to_priority(value: str) -> str:
    if value in {"critical", "high"}:
        return "high"
    if value == "medium":
        return "medium"
    return "low"


def generate_tasks(state: dict) -> TasksResponse:
    followups = build_followup_schedule(state)
    bottleneck_insights = detect_bottleneck_insights(state)
    decay_items = compute_opportunity_decay(state)

    action_queue: list[ActionQueueItem] = []

    for idx, followup in enumerate(followups, start=1):
        urgency = "critical" if "overdue" in followup.reason else "high"
        action_queue.append(
            ActionQueueItem(
                id=f"action-followup-{idx}",
                title=f"Follow up with {followup.startupName}",
                urgency=urgency,
                dueDate=followup.dueDate,
                linkedApplicationId=followup.applicationId,
                reason=followup.reason,
            )
        )

    for item in decay_items[:3]:
        if item["urgency"] in {"critical", "high"}:
            action_queue.append(
                ActionQueueItem(
                    id=f"action-decay-{item['applicationId']}",
                    title=f"Refresh touchpoint for {item['startupName']}",
                    urgency=str(item["urgency"]),
                    dueDate=state["weekOf"],
                    linkedApplicationId=str(item["applicationId"]),
                    reason=str(item["reason"]),
                )
            )

    for idx, insight in enumerate(bottleneck_insights, start=1):
        severity = str(insight["severity"])
        if severity == "low":
            continue
        urgency = "high" if severity == "high" else "medium"
        action_queue.append(
            ActionQueueItem(
                id=f"action-bottleneck-{idx}",
                title=f"Fix bottleneck: {insight['code']}",
                urgency=urgency,
                dueDate=state["weekOf"],
                reason=str(insight["recommendedAction"]),
            )
        )

    deduped: dict[tuple[str, str | None], ActionQueueItem] = {}
    for action in action_queue:
        key = (action.title, action.linkedApplicationId)
        if key not in deduped:
            deduped[key] = action
    action_queue = sorted(deduped.values(), key=lambda item: (_urgency_rank(item.urgency), item.dueDate))

    tasks: list[TaskItem] = [
        TaskItem(
            id=item.id,
            title=item.title,
            category="action-queue",
            priority=_to_priority(item.urgency),
            dueDate=item.dueDate,
            linkedApplicationId=item.linkedApplicationId,
            reason=item.reason,
        )
        for item in action_queue
    ]

    return TasksResponse(
        items=tasks,
        followups=followups,
        actionQueue=action_queue,
        reason="Tasks are generated from follow-up urgency, opportunity decay, and bottleneck severity.",
    )

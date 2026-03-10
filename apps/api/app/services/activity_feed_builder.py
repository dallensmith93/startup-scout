from __future__ import annotations

from datetime import date

from app.models.activity import ActivityFeedResponse, ActivityItem


def build_activity_feed(state: dict) -> ActivityFeedResponse:
    reference_date = date.fromisoformat(state["weekOf"])
    timeline: list[ActivityItem] = []

    for app in state["applications"]:
        due_date = date.fromisoformat(app["dueDate"])
        days_until_due = (due_date - reference_date).days
        status = "overdue" if days_until_due < 0 else ("due today" if days_until_due == 0 else f"due in {days_until_due}d")
        timeline.append(
            ActivityItem(
                id=f"activity-due-{app['id']}",
                timestamp=f"{app['dueDate']}T09:00:00",
                type="deadline",
                title=f"{app['startupName']} - {app['roleTitle']}",
                detail=f"Application timeline checkpoint is {status}.",
                relatedApplicationId=app["id"],
            )
        )

        timeline.append(
            ActivityItem(
                id=f"activity-touch-{app['id']}",
                timestamp=f"{app['lastTouchAt']}T17:00:00",
                type="touchpoint",
                title=f"Last touchpoint logged for {app['startupName']}",
                detail=f"Current stage: {app['stage']} (status: {app['status']}).",
                relatedApplicationId=app["id"],
            )
        )

    for idx, outreach in enumerate(state.get("outreach", []), start=1):
        timeline.append(
            ActivityItem(
                id=f"activity-outreach-{idx}",
                timestamp=f"{outreach['date']}T18:00:00",
                type="outreach",
                title="Outreach session summary",
                detail=(
                    f"Sent {outreach['sent']} messages, received {outreach['responses']} responses, "
                    f"booked {outreach['interviews']} interviews."
                ),
            )
        )

    timeline.sort(key=lambda item: item.timestamp, reverse=True)
    return ActivityFeedResponse(
        generatedForDate=state["weekOf"],
        timeline=timeline[:25],
        reason="Timeline merges application deadlines, touchpoints, and outreach outcomes in reverse chronological order.",
    )

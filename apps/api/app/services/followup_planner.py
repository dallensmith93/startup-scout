from __future__ import annotations

from app.models.tracker import FollowupReminder, TrackerItem
from app.services.application_tracker import followup_due_date, should_follow_up


def generate_followups(items: list[TrackerItem]) -> list[FollowupReminder]:
    reminders: list[FollowupReminder] = []
    for item in items:
        if not should_follow_up(item.updatedAt, item.status):
            continue
        urgency = "high" if item.status == "interview" else "medium"
        reminders.append(
            FollowupReminder(
                applicationId=item.applicationId,
                startupName=item.startupName,
                roleTitle=item.roleTitle,
                urgency=urgency,
                reason=f"No update since {item.updatedAt}; follow-up target {followup_due_date(item.updatedAt)}.",
                suggestedMessage=(
                    f"Hi {item.startupName} team, following up on the {item.roleTitle} process. "
                    "I remain highly interested and can share additional work samples if helpful."
                ),
            )
        )
    return reminders

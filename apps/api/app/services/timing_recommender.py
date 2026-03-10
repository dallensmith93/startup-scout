from __future__ import annotations


def recommend_timing(days_until_due: int, stage: str, intensity: str) -> str:
    if days_until_due < 0:
        return "Execute now: send in the next 60 minutes."
    if days_until_due == 0:
        return "Do this today in your first available 90-minute focus block."
    if stage == "follow-up":
        return "Schedule a follow-up tomorrow morning between 09:00 and 11:00."
    if intensity == "high":
        return "Batch this in today's final outreach block."
    return "Schedule this in your next weekday morning outreach window."

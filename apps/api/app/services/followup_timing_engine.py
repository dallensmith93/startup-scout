from __future__ import annotations


def recommend_followup_timing(last_touch_days: int, stage: str) -> str:
    if last_touch_days >= 10:
        return "Send follow-up today within next 4 hours."
    if stage == "active":
        return "Follow up within 24 hours to maintain momentum."
    return "Queue follow-up for the next focused outreach block."


def recommend_followup_timing_with_reason(last_touch_days: int, stage: str, relationship_score: int) -> tuple[str, str]:
    recommendation = recommend_followup_timing(last_touch_days, stage)
    if last_touch_days >= 10:
        reason = f"{last_touch_days} days since last touch makes this a stale-thread recovery."
    elif stage == "active":
        reason = "Active stage requires tighter cadence to preserve scheduling momentum."
    elif relationship_score >= 75:
        reason = "Strong relationship allows steady cadence without aggressive follow-up frequency."
    else:
        reason = "Moderate relationship score favors a paced but consistent next touch."
    return recommendation, reason

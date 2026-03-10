from __future__ import annotations

from app.models.relationship_health import RelationshipHealthItem, RelationshipHealthResponse, RelationshipHealthSummary
from app.services.contact_intelligence import list_contacts
from app.services.followup_timing_engine import recommend_followup_timing_with_reason
from app.services.relationship_strength import compute_relationship_strength


def _stale_risk(last_touch_days: int, stage: str) -> tuple[int, str]:
    stage_modifier = {"active": 8, "warm": 4, "new": 0}.get(stage, 0)
    score = min(100, max(0, round(last_touch_days * 6 - stage_modifier)))
    reason = (
        f"Stale risk score {score} comes from {last_touch_days} day(s) since last touch and stage modifier {stage_modifier}."
    )
    return score, reason


def build_relationship_health() -> RelationshipHealthResponse:
    contacts = list_contacts()
    items: list[RelationshipHealthItem] = []

    for entry in contacts.contacts:
        health_score, health_reason = compute_relationship_strength(
            entry.relationshipScore,
            entry.lastTouchDays,
            entry.stage,
        )
        stale_score, stale_reason = _stale_risk(entry.lastTouchDays, entry.stage)
        next_touch, next_touch_reason = recommend_followup_timing_with_reason(
            entry.lastTouchDays,
            entry.stage,
            entry.relationshipScore,
        )
        urgency = "high" if health_score < 55 else "medium" if health_score < 75 else "low"

        items.append(
            RelationshipHealthItem(
                contactId=entry.id,
                name=entry.name,
                company=entry.company,
                healthScore=health_score,
                healthScoreReason=health_reason,
                staleRiskScore=stale_score,
                staleRiskReason=stale_reason,
                urgency=urgency,
                nextTouchRecommendation=next_touch,
                nextTouchReason=next_touch_reason,
                reason="Health score applies freshness decay to relationship strength.",
            )
        )

    items.sort(key=lambda item: item.healthScore)
    strongest_contact = max(items, key=lambda item: item.healthScore).contactId if items else None
    summary = RelationshipHealthSummary(
        total=len(items),
        atRisk=len([item for item in items if item.urgency == "high"]),
        stable=len([item for item in items if item.urgency == "low"]),
        strongestContactId=strongest_contact,
        reason="Summary is based on urgency bands and maximum health score.",
    )

    return RelationshipHealthResponse(
        generatedForDate=contacts.generatedForDate,
        summary=summary,
        items=items,
        reason="Relationship health is derived from score and communication recency.",
    )

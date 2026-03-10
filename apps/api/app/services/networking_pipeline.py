from __future__ import annotations

from app.models.connection import ConnectionItem, ConnectionsResponse, ConnectionsSummary
from app.services.contact_intelligence import list_contacts
from app.services.followup_timing_engine import recommend_followup_timing_with_reason
from app.services.response_likelihood import response_likelihood


def build_connections_board() -> ConnectionsResponse:
    contacts = list_contacts()
    items: list[ConnectionItem] = []

    for contact in contacts.contacts:
        likelihood, likelihood_reason = response_likelihood(
            contact.relationshipScore,
            contact.stage,
            contact.lastTouchDays,
        )
        timing, timing_reason = recommend_followup_timing_with_reason(
            contact.lastTouchDays,
            contact.stage,
            contact.relationshipScore,
        )

        items.append(
            ConnectionItem(
                id=contact.id,
                name=contact.name,
                role=contact.role,
                company=contact.company,
                stage=contact.stage,
                relationshipScore=contact.relationshipScore,
                relationshipScoreReason=contact.relationshipScoreReason,
                responseLikelihood=likelihood,
                responseLikelihoodReason=likelihood_reason,
                recommendedTiming=timing,
                recommendedTimingReason=timing_reason,
                recommendedNextStep=contact.nextAction,
                reason="Connection card combines strength, response probability, and timing recommendation.",
            )
        )

    items.sort(key=lambda item: (item.responseLikelihood, item.relationshipScore), reverse=True)
    summary = ConnectionsSummary(
        total=len(items),
        highLikelihood=len([item for item in items if item.responseLikelihood >= 70]),
        needsAttention=len([item for item in items if item.stage == "new" or item.responseLikelihood < 55]),
        reason="Summary is derived from response-likelihood thresholds and stage state.",
    )

    return ConnectionsResponse(
        generatedForDate=contacts.generatedForDate,
        summary=summary,
        items=items,
        reason="Connections board ranks who to contact next based on deterministic probability and timing logic.",
    )

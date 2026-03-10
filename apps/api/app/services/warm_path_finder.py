from __future__ import annotations

from app.models.outreach import WarmPathItem, WarmPathsResponse, WarmPathsSummary
from app.services.contact_intelligence import list_contacts
from app.services.response_likelihood import intro_likelihood_with_reason


def _recommended_path(stage: str, company: str, role: str) -> tuple[str, str]:
    if stage == "active":
        return (
            f"Ask for a direct scheduling intro to the hiring owner for {company}.",
            "Active relationships can support explicit scheduling requests.",
        )
    if stage == "warm":
        return (
            f"Request a light referral framing for a {role} conversation at {company}.",
            "Warm contacts are well-suited to soft intros with clear relevance.",
        )
    return (
        f"Start with a context refresh before asking for an intro at {company}.",
        "New relationships need one trust-building step before referral asks.",
    )


def find_warm_paths() -> WarmPathsResponse:
    contacts = list_contacts()
    items: list[WarmPathItem] = []

    for entry in contacts.contacts:
        likelihood, likelihood_reason = intro_likelihood_with_reason(
            entry.relationshipScore,
            entry.stage,
            entry.lastTouchDays,
        )
        rec_path, rec_path_reason = _recommended_path(entry.stage, entry.company, entry.role)
        path_score = min(100, round((entry.relationshipScore * 0.7) + (likelihood * 0.3)))

        items.append(
            WarmPathItem(
                contactId=entry.id,
                name=entry.name,
                company=entry.company,
                pathScore=path_score,
                pathScoreReason=(
                    f"Path score blends relationship strength {entry.relationshipScore} and intro likelihood {likelihood}."
                ),
                introLikelihood=likelihood,
                introLikelihoodReason=likelihood_reason,
                recommendedPath=rec_path,
                recommendedPathReason=rec_path_reason,
                reason="Path score combines relationship strength and intro likelihood.",
            )
        )

    items.sort(key=lambda item: item.pathScore, reverse=True)
    avg_score = round(sum(item.pathScore for item in items) / len(items)) if items else 0
    summary = WarmPathsSummary(
        total=len(items),
        topScore=items[0].pathScore if items else 0,
        averageScore=avg_score,
        reason="Summary aggregates ranked warm-path scores for quick prioritization.",
    )

    return WarmPathsResponse(
        generatedForDate=contacts.generatedForDate,
        summary=summary,
        items=items,
        reason="Warm paths are ranked deterministically by score.",
    )

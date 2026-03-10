from __future__ import annotations

from app.models.outreach import FollowupDraft, OutreachHubResponse, ReferralAsk
from app.services.contact_intelligence import list_contacts
from app.services.followup_timing_engine import recommend_followup_timing_with_reason
from app.services.outreach_context_builder import build_outreach_context
from app.services.response_likelihood import response_likelihood


def _build_followup_draft(name: str, company: str, role: str) -> str:
    return (
        f"Hi {name}, quick update: I shipped a recent backend reliability win relevant to {company}. "
        f"If helpful, I can share a 3-bullet fit summary for the {role} role."
    )


def build_outreach_hub() -> OutreachHubResponse:
    contacts = list_contacts()
    context = build_outreach_context(contacts.contacts)

    followup_drafts: list[FollowupDraft] = []
    for entry in contacts.contacts[:3]:
        likelihood, likelihood_reason = response_likelihood(entry.relationshipScore, entry.stage, entry.lastTouchDays)
        send_window, send_reason = recommend_followup_timing_with_reason(
            entry.lastTouchDays,
            entry.stage,
            entry.relationshipScore,
        )
        priority_score = min(100, round(entry.relationshipScore * 0.5 + likelihood * 0.5))
        followup_drafts.append(
            FollowupDraft(
                contactId=entry.id,
                contactName=entry.name,
                company=entry.company,
                title=f"Follow-up for {entry.company}",
                draft=_build_followup_draft(entry.name, entry.company, entry.role),
                priorityScore=priority_score,
                priorityReason=(
                    f"Priority score combines relationship score {entry.relationshipScore} and response likelihood {likelihood}."
                ),
                recommendedSendWindow=send_window,
                recommendedSendWindowReason=send_reason,
                reason=f"Response-likelihood signal: {likelihood_reason}",
            )
        )

    referral_asks: list[ReferralAsk] = []
    for entry in [item for item in contacts.contacts if item.stage in {"active", "warm"}][:2]:
        confidence_score = min(100, round(entry.relationshipScore * 0.65 + max(0, 20 - entry.lastTouchDays)))
        referral_asks.append(
            ReferralAsk(
                contactId=entry.id,
                contactName=entry.name,
                ask=f"Would you be open to introducing me to the hiring owner at {entry.company}?",
                confidenceScore=confidence_score,
                confidenceReason=(
                    f"Confidence uses relationship score {entry.relationshipScore} and recency {entry.lastTouchDays} day(s)."
                ),
                reason="Ask is explicit and scoped to one introduction target.",
            )
        )

    return OutreachHubResponse(
        generatedForDate=contacts.generatedForDate,
        focus="Move two strong contacts to concrete interview conversations this week.",
        focusReason="Focus prioritizes high-likelihood paths over broad low-context outreach.",
        tone="Warm, direct, and proof-driven.",
        toneReason="This tone balances relationship trust with clear execution intent.",
        context=context,
        followupDrafts=followup_drafts,
        referralAsks=referral_asks,
        reason="Outreach hub is deterministic from contact stage, relationship strength, and reply likelihood.",
    )

from __future__ import annotations

from app.models.contact import Contact
from app.models.outreach import OutreachContext


def build_outreach_context(contacts: list[Contact] | None = None) -> OutreachContext:
    contact_list = contacts or []
    active_count = len([item for item in contact_list if item.stage == "active"])
    warm_count = len([item for item in contact_list if item.stage == "warm"])

    plays = [
        "Lead with one concrete progress update tied to the target role.",
        "Use one explicit ask per message to reduce reply friction.",
        "Close with a specific next-step window (15 minutes or less).",
    ]

    headline = (
        "Convert warm network momentum into interview-relevant conversations this week."
        if active_count + warm_count >= 2
        else "Build initial trust with concise, role-specific outreach."
    )
    reason = (
        f"Context is based on {active_count} active and {warm_count} warm contacts, "
        "favoring concise updates plus clear asks."
    )
    return OutreachContext(headline=headline, plays=plays, reason=reason)

from __future__ import annotations

import json
from pathlib import Path

from app.models.contact import (
    Contact,
    ContactDetailResponse,
    ContactListResponse,
    ContactMessageEntry,
    ContactSummary,
    ContactTimelineEntry,
)


DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "mock_network.json"


def _load_state() -> dict:
    return json.loads(DATA_PATH.read_text(encoding="utf-8"))


def _next_action(stage: str, last_touch_days: int) -> tuple[str, str]:
    if last_touch_days >= 12:
        return (
            "Reopen the thread today with a concise update and one clear ask.",
            f"{last_touch_days} days since last touch increases drop-off risk.",
        )
    if stage == "active":
        return (
            "Send a scheduling nudge within 24 hours.",
            "Active conversations benefit from tight execution cadence.",
        )
    if stage == "warm":
        return (
            "Share one role-specific progress update this week.",
            "Warm contacts convert best when relevance stays explicit.",
        )
    return (
        "Send a short re-introduction and restate mutual context.",
        "New contacts need context refresh before escalation asks.",
    )


def _score_reason(stage: str, score: int, last_touch_days: int) -> str:
    return (
        f"Relationship score {score} reflects stage '{stage}' with last touch {last_touch_days} day(s) ago "
        "from deterministic network state."
    )


def _to_contact(row: dict) -> Contact:
    next_action, next_action_reason = _next_action(row["stage"], row["lastTouchDays"])
    return Contact(
        id=row["id"],
        name=row["name"],
        role=row["role"],
        company=row["company"],
        stage=row["stage"],
        relationshipScore=row["relationshipScore"],
        relationshipScoreReason=_score_reason(row["stage"], row["relationshipScore"], row["lastTouchDays"]),
        lastTouchDays=row["lastTouchDays"],
        notes=row.get("notes", ""),
        nextAction=next_action,
        nextActionReason=next_action_reason,
    )


def list_contacts() -> ContactListResponse:
    state = _load_state()
    contacts = [_to_contact(item) for item in state.get("contacts", [])]
    contacts.sort(key=lambda item: (item.relationshipScore, -item.lastTouchDays), reverse=True)

    summary = ContactSummary(
        total=len(contacts),
        active=len([item for item in contacts if item.stage == "active"]),
        warm=len([item for item in contacts if item.stage == "warm"]),
        new=len([item for item in contacts if item.stage == "new"]),
        needsAttention=len([item for item in contacts if item.lastTouchDays >= 10]),
        reason="Summary counts are deterministic stage and recency rollups from the contact map.",
    )
    return ContactListResponse(
        generatedForDate=state.get("generatedForDate", ""),
        summary=summary,
        contacts=contacts,
        reason="Contacts are loaded deterministically from mock network state with derived next actions.",
    )


def get_contact(contact_id: str) -> ContactDetailResponse:
    state = _load_state()
    rows = state.get("contacts", [])
    selected = next((item for item in rows if item.get("id") == contact_id), None)
    if selected is None:
        raise ValueError(f"Unknown contact id: {contact_id}")

    contact = _to_contact(selected)
    timeline = [ContactTimelineEntry.model_validate(item) for item in selected.get("timeline", [])]
    message_history = [ContactMessageEntry.model_validate(item) for item in selected.get("messages", [])]

    if not timeline:
        timeline = [
            ContactTimelineEntry(
                date=state.get("generatedForDate", ""),
                title="Contact added",
                detail="Added to networking workspace.",
                reason="Default timeline entry used when no explicit history exists.",
            )
        ]

    return ContactDetailResponse(
        contact=contact,
        timeline=timeline,
        messageHistory=message_history,
        reason="Contact detail combines stable profile fields with deterministic timeline and message history.",
    )

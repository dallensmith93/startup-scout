from app.models.contact import Contact, ContactListResponse
from app.services.relationship_health_engine import build_relationship_health


def _mock_contacts() -> ContactListResponse:
    return ContactListResponse(
        generatedForDate="2026-03-09",
        reason="stub",
        contacts=[
            Contact(
                id="contact-1",
                name="Avery Kim",
                role="Engineering Manager",
                company="OrbitNest",
                stage="warm",
                relationshipScore=78,
                lastTouchDays=6,
                notes="",
            ),
            Contact(
                id="contact-2",
                name="Jordan Hale",
                role="Founder",
                company="SignalForge",
                stage="new",
                relationshipScore=52,
                lastTouchDays=14,
                notes="",
            ),
            Contact(
                id="contact-3",
                name="Riley Chen",
                role="Talent Partner",
                company="Nimbus Grid",
                stage="active",
                relationshipScore=84,
                lastTouchDays=3,
                notes="",
            ),
        ],
    )


def test_relationship_health_is_ranked_lowest_to_highest_with_reasons(monkeypatch) -> None:
    monkeypatch.setattr("app.services.relationship_health_engine.list_contacts", _mock_contacts)
    result = build_relationship_health()

    assert result.reason == "Relationship health is derived from score and communication recency."
    assert [item.contactId for item in result.items] == ["contact-2", "contact-1", "contact-3"]
    assert [item.healthScore for item in result.items] == [27, 66, 78]
    assert [item.urgency for item in result.items] == ["high", "medium", "low"]
    assert all(
        item.reason == "Health score applies freshness decay to relationship strength."
        for item in result.items
    )


def test_relationship_health_urgency_threshold_edges(monkeypatch) -> None:
    def _stub_contacts() -> ContactListResponse:
        return ContactListResponse(
            generatedForDate="2026-03-09",
            reason="stub",
            contacts=[
                Contact(
                    id="edge-high",
                    name="High",
                    role="Eng",
                    company="Acme",
                    stage="warm",
                    relationshipScore=54,
                    lastTouchDays=0,
                    notes="",
                ),
                Contact(
                    id="edge-medium",
                    name="Medium",
                    role="Eng",
                    company="Acme",
                    stage="warm",
                    relationshipScore=55,
                    lastTouchDays=0,
                    notes="",
                ),
                Contact(
                    id="edge-low",
                    name="Low",
                    role="Eng",
                    company="Acme",
                    stage="warm",
                    relationshipScore=75,
                    lastTouchDays=0,
                    notes="",
                ),
            ],
        )

    monkeypatch.setattr("app.services.relationship_health_engine.list_contacts", _stub_contacts)
    result = build_relationship_health()

    assert [item.contactId for item in result.items] == ["edge-high", "edge-medium", "edge-low"]
    assert [item.urgency for item in result.items] == ["high", "medium", "low"]

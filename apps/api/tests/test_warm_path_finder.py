from app.models.contact import Contact, ContactListResponse
from app.services.warm_path_finder import find_warm_paths


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


def test_warm_paths_rank_contacts_by_path_score_and_include_reasons(monkeypatch) -> None:
    monkeypatch.setattr("app.services.warm_path_finder.list_contacts", _mock_contacts)
    result = find_warm_paths()

    assert result.reason == "Warm paths are ranked deterministically by score."
    assert [item.contactId for item in result.items] == ["contact-3", "contact-1", "contact-2"]
    assert [item.pathScore for item in result.items] == [85, 77, 50]
    assert [item.introLikelihood for item in result.items] == [86, 76, 46]
    assert all(
        item.reason == "Path score combines relationship strength and intro likelihood."
        for item in result.items
    )


def test_warm_paths_preserve_input_order_for_tied_scores(monkeypatch) -> None:
    def _stub_contacts() -> ContactListResponse:
        return ContactListResponse(
            generatedForDate="2026-03-09",
            reason="stub",
            contacts=[
                Contact(
                    id="contact-b",
                    name="B",
                    role="Eng",
                    company="Acme",
                    stage="warm",
                    relationshipScore=70,
                    lastTouchDays=1,
                    notes="",
                ),
                Contact(
                    id="contact-a",
                    name="A",
                    role="Eng",
                    company="Acme",
                    stage="warm",
                    relationshipScore=70,
                    lastTouchDays=1,
                    notes="",
                ),
            ],
        )

    monkeypatch.setattr("app.services.warm_path_finder.list_contacts", _stub_contacts)
    result = find_warm_paths()

    assert [item.contactId for item in result.items] == ["contact-b", "contact-a"]

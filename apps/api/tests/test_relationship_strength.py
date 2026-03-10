from app.services.relationship_strength import relationship_strength


def test_relationship_strength_applies_freshness_decay() -> None:
    assert relationship_strength(78, 6) == 66
    assert relationship_strength(84, 3) == 78


def test_relationship_strength_caps_decay_for_very_old_touches() -> None:
    assert relationship_strength(80, 999) == 55


def test_relationship_strength_clamps_to_bounds() -> None:
    assert relationship_strength(5, 10) == 0
    assert relationship_strength(150, 0) == 100

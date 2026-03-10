from app.services.response_likelihood import intro_likelihood


def test_intro_likelihood_uses_stage_bonus_values() -> None:
    assert intro_likelihood(60, "active") == 62
    assert intro_likelihood(60, "warm") == 58
    assert intro_likelihood(60, "new") == 54
    assert intro_likelihood(60, "unknown") == 52


def test_intro_likelihood_clamps_at_edges() -> None:
    assert intro_likelihood(2, "unknown") == 0
    assert intro_likelihood(98, "active") == 100

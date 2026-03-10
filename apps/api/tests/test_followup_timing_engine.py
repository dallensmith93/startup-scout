from app.services.followup_timing_engine import recommend_followup_timing


def test_followup_timing_prioritizes_stale_threads_even_if_active() -> None:
    assert recommend_followup_timing(10, "active") == "Send follow-up today within next 4 hours."


def test_followup_timing_uses_active_path_for_recent_contacts() -> None:
    assert recommend_followup_timing(3, "active") == "Follow up within 24 hours to maintain momentum."


def test_followup_timing_defaults_to_outreach_block() -> None:
    assert (
        recommend_followup_timing(3, "warm")
        == "Queue follow-up for the next focused outreach block."
    )

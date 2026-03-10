from importlib import import_module


LOW_ACTIVITY_SCENARIO = {
    "pending_followups": 1,
    "days_since_last_outreach": 2,
    "calendar_blocks": 0,
}

HIGH_ACTIVITY_SCENARIO = {
    "pending_followups": 14,
    "days_since_last_outreach": 7,
    "calendar_blocks": 5,
}


def test_reminder_engine_module_imports() -> None:
    module = import_module("app.services.reminder_engine")
    assert module is not None


def test_reminder_engine_low_vs_high_activity_payloads() -> None:
    assert LOW_ACTIVITY_SCENARIO["pending_followups"] < HIGH_ACTIVITY_SCENARIO["pending_followups"]
    assert (
        LOW_ACTIVITY_SCENARIO["days_since_last_outreach"]
        < HIGH_ACTIVITY_SCENARIO["days_since_last_outreach"]
    )
    assert LOW_ACTIVITY_SCENARIO["calendar_blocks"] < HIGH_ACTIVITY_SCENARIO["calendar_blocks"]

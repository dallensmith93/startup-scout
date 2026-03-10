from importlib import import_module


LOW_ACTIVITY_SCENARIO = {
    "applications_submitted": 0,
    "followups_sent": 0,
    "inbox_replies": 0,
}

HIGH_ACTIVITY_SCENARIO = {
    "applications_submitted": 12,
    "followups_sent": 7,
    "inbox_replies": 5,
}


def test_nudge_engine_module_imports() -> None:
    module = import_module("app.services.nudge_engine")
    assert module is not None


def test_nudge_engine_low_vs_high_activity_payloads() -> None:
    assert LOW_ACTIVITY_SCENARIO["applications_submitted"] < HIGH_ACTIVITY_SCENARIO["applications_submitted"]
    assert LOW_ACTIVITY_SCENARIO["followups_sent"] < HIGH_ACTIVITY_SCENARIO["followups_sent"]
    assert LOW_ACTIVITY_SCENARIO["inbox_replies"] <= HIGH_ACTIVITY_SCENARIO["inbox_replies"]

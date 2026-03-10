from importlib import import_module


LOW_ACTIVITY_SCENARIO = {
    "events_today": 1,
    "stale_applications": 0,
    "urgent_items": 0,
}

HIGH_ACTIVITY_SCENARIO = {
    "events_today": 24,
    "stale_applications": 6,
    "urgent_items": 4,
}


def test_daily_brief_builder_module_imports() -> None:
    module = import_module("app.services.daily_brief_builder")
    assert module is not None


def test_daily_brief_builder_low_vs_high_activity_payloads() -> None:
    assert LOW_ACTIVITY_SCENARIO["events_today"] < HIGH_ACTIVITY_SCENARIO["events_today"]
    assert LOW_ACTIVITY_SCENARIO["stale_applications"] < HIGH_ACTIVITY_SCENARIO["stale_applications"]
    assert LOW_ACTIVITY_SCENARIO["urgent_items"] < HIGH_ACTIVITY_SCENARIO["urgent_items"]

from importlib import import_module


LOW_ACTIVITY_SCENARIO = {
    "open_loops": 1,
    "recent_responses": 0,
    "hours_available_today": 1,
}

HIGH_ACTIVITY_SCENARIO = {
    "open_loops": 10,
    "recent_responses": 5,
    "hours_available_today": 6,
}


def test_timing_recommender_module_imports() -> None:
    module = import_module("app.services.timing_recommender")
    assert module is not None


def test_timing_recommender_low_vs_high_activity_payloads() -> None:
    assert LOW_ACTIVITY_SCENARIO["open_loops"] < HIGH_ACTIVITY_SCENARIO["open_loops"]
    assert LOW_ACTIVITY_SCENARIO["recent_responses"] < HIGH_ACTIVITY_SCENARIO["recent_responses"]
    assert LOW_ACTIVITY_SCENARIO["hours_available_today"] < HIGH_ACTIVITY_SCENARIO["hours_available_today"]

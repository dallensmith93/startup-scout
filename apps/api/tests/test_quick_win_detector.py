from importlib import import_module


LOW_ACTIVITY_SCENARIO = {
    "near_match_roles": 1,
    "warm_contacts": 0,
    "easy_actions_available": 1,
}

HIGH_ACTIVITY_SCENARIO = {
    "near_match_roles": 9,
    "warm_contacts": 4,
    "easy_actions_available": 7,
}


def test_quick_win_detector_module_imports() -> None:
    module = import_module("app.services.quick_win_detector")
    assert module is not None


def test_quick_win_detector_low_vs_high_activity_payloads() -> None:
    assert LOW_ACTIVITY_SCENARIO["near_match_roles"] < HIGH_ACTIVITY_SCENARIO["near_match_roles"]
    assert LOW_ACTIVITY_SCENARIO["warm_contacts"] < HIGH_ACTIVITY_SCENARIO["warm_contacts"]
    assert LOW_ACTIVITY_SCENARIO["easy_actions_available"] < HIGH_ACTIVITY_SCENARIO["easy_actions_available"]

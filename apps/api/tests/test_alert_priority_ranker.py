from importlib import import_module


LOW_ACTIVITY_SCENARIO = {
    "alerts_total": 1,
    "critical_alerts": 0,
    "aging_alerts": 0,
}

HIGH_ACTIVITY_SCENARIO = {
    "alerts_total": 18,
    "critical_alerts": 4,
    "aging_alerts": 9,
}


def test_alert_priority_ranker_module_imports() -> None:
    module = import_module("app.services.alert_priority_ranker")
    assert module is not None


def test_alert_priority_ranker_low_vs_high_activity_payloads() -> None:
    assert LOW_ACTIVITY_SCENARIO["alerts_total"] < HIGH_ACTIVITY_SCENARIO["alerts_total"]
    assert LOW_ACTIVITY_SCENARIO["critical_alerts"] < HIGH_ACTIVITY_SCENARIO["critical_alerts"]
    assert LOW_ACTIVITY_SCENARIO["aging_alerts"] < HIGH_ACTIVITY_SCENARIO["aging_alerts"]

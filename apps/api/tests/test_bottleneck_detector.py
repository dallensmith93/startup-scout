from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.bottleneck_detector import detect_bottlenecks
from app.services.dashboard_aggregator import load_search_state


def test_bottleneck_detector_returns_explanations() -> None:
    messages = detect_bottlenecks(load_search_state())
    assert len(messages) >= 1
    assert all(isinstance(msg, str) and msg for msg in messages)


def test_bottleneck_detector_handles_healthy_state() -> None:
    state = load_search_state()
    for app in state["applications"]:
        app["fitScore"] = 90
        app["stage"] = "application"
        app["lastTouchAt"] = "2026-03-09"
        app["dueDate"] = "2026-03-13"
    state["outreach"] = [{"date": "2026-03-10", "sent": 10, "responses": 5, "interviews": 2}]
    messages = detect_bottlenecks(state)
    assert messages == ["No critical bottlenecks detected; execution cadence is healthy."]


def test_bottleneck_detector_returns_detailed_multi_signal_messages() -> None:
    state = load_search_state()
    state["applications"] = [
        {
            "id": "a1",
            "startupName": "A",
            "roleTitle": "Engineer",
            "status": "applied",
            "stage": "follow-up",
            "fitScore": 65,
            "riskScore": 50,
            "priorityScore": 70,
            "lastTouchAt": "2026-03-04",
            "dueDate": "2026-03-11",
            "responseReceived": False,
            "interviewScheduled": False,
            "channel": "direct",
        },
        {
            "id": "a2",
            "startupName": "B",
            "roleTitle": "Engineer",
            "status": "applied",
            "stage": "follow-up",
            "fitScore": 69,
            "riskScore": 52,
            "priorityScore": 72,
            "lastTouchAt": "2026-03-03",
            "dueDate": "2026-03-12",
            "responseReceived": False,
            "interviewScheduled": False,
            "channel": "referral",
        },
    ]
    state["outreach"] = [{"date": "2026-03-10", "sent": 10, "responses": 1, "interviews": 0}]

    messages = detect_bottlenecks(state)

    assert "2 opportunities are waiting for follow-up, creating avoidable decay risk." in messages
    assert "2 roles have fit score below 70, reducing expected conversion quality." in messages
    assert "Outreach response rate is 10%, below the 20% operating baseline." in messages

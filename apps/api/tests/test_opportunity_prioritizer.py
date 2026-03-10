from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.opportunity_prioritizer import prioritize_opportunities
from app.services.dashboard_aggregator import load_search_state


def test_opportunity_prioritizer_sorted_desc() -> None:
    state = load_search_state()
    result = prioritize_opportunities(state)
    assert len(result.queue) == len(state["applications"])
    assert all(0 <= item.decayScore <= 100 for item in result.queue)
    assert all(0 <= item.effectivePriorityScore <= 100 for item in result.queue)
    assert {item.applicationId for item in result.queue} == {item["id"] for item in state["applications"]}
    assert all(item.whyNow for item in result.queue)


def test_opportunity_prioritizer_breaks_ties_with_fit_score() -> None:
    state = load_search_state()
    state["applications"] = [
        {
            "id": "app_low_fit",
            "startupName": "LowFit",
            "roleTitle": "Engineer",
            "status": "applied",
            "stage": "application",
            "fitScore": 70,
            "riskScore": 40,
            "priorityScore": 80,
            "lastTouchAt": "2026-03-08",
            "dueDate": "2026-03-12",
            "responseReceived": False,
            "interviewScheduled": False,
            "channel": "direct",
        },
        {
            "id": "app_high_fit",
            "startupName": "HighFit",
            "roleTitle": "Engineer",
            "status": "applied",
            "stage": "application",
            "fitScore": 90,
            "riskScore": 40,
            "priorityScore": 80,
            "lastTouchAt": "2026-03-08",
            "dueDate": "2026-03-11",
            "responseReceived": False,
            "interviewScheduled": False,
            "channel": "referral",
        },
    ]

    result = prioritize_opportunities(state)

    assert result.queue[0].applicationId == "app_high_fit"
    assert "decay" in result.queue[0].whyNow
    assert "due" in result.queue[0].whyNow

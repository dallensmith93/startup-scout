from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.search_analytics import compute_analytics
from app.services.dashboard_aggregator import load_search_state


def test_search_analytics_returns_funnel_and_rates() -> None:
    result = compute_analytics(load_search_state())
    assert result.applicationsTotal >= 1
    assert 0 <= result.responseRate <= 100
    assert 0 <= result.interviewRate <= 100
    assert result.funnel.applied >= 0
    assert result.reason


def test_search_analytics_includes_outreach_performance_insights() -> None:
    state = load_search_state()
    result = compute_analytics(state)

    expected_sent = sum(day["sent"] for day in state["outreach"])
    expected_responses = sum(day["responses"] for day in state["outreach"])

    assert result.outreachSent == expected_sent
    assert result.outreachResponses == expected_responses
    assert result.momentumScore >= 0

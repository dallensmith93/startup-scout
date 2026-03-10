from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.momentum_analyzer import compute_momentum_score, compute_opportunity_decay, compute_weekly_focus_score
from app.services.dashboard_aggregator import load_search_state


def test_momentum_score_in_range() -> None:
    score = compute_momentum_score(load_search_state())
    assert 0 <= score <= 100


def test_momentum_score_drops_with_zero_outreach() -> None:
    state = load_search_state()
    state["outreach"] = []
    for app in state["applications"]:
        app["responseReceived"] = False
        app["interviewScheduled"] = False
    score = compute_momentum_score(state)
    assert score < 55


def test_momentum_score_rewards_stronger_outreach_conversion() -> None:
    state_low = load_search_state()
    state_high = load_search_state()

    # Keep application-stage signals equal and only vary outreach response performance.
    for app in state_low["applications"]:
        app["responseReceived"] = False
        app["interviewScheduled"] = False
    for app in state_high["applications"]:
        app["responseReceived"] = False
        app["interviewScheduled"] = False

    state_low["outreach"] = [{"date": "2026-03-10", "sent": 10, "responses": 1, "interviews": 0}]
    state_high["outreach"] = [{"date": "2026-03-10", "sent": 10, "responses": 6, "interviews": 0}]

    low_score = compute_momentum_score(state_low)
    high_score = compute_momentum_score(state_high)

    assert high_score > low_score


def test_weekly_focus_and_momentum_move_together_when_outreach_drops() -> None:
    baseline = load_search_state()
    degraded = load_search_state()

    degraded["outreach"] = []
    for app in degraded["applications"]:
        app["responseReceived"] = False
        app["interviewScheduled"] = False

    baseline_momentum = compute_momentum_score(baseline)
    degraded_momentum = compute_momentum_score(degraded)
    baseline_focus = compute_weekly_focus_score(baseline)
    degraded_focus = compute_weekly_focus_score(degraded)

    assert degraded_momentum < baseline_momentum
    assert degraded_focus < baseline_focus


def test_opportunity_decay_prioritizes_more_urgent_items() -> None:
    state = load_search_state()
    decay = compute_opportunity_decay(state)

    assert decay
    assert decay[0]["decayScore"] >= decay[-1]["decayScore"]
    assert all(item["urgency"] in {"critical", "high", "medium", "low"} for item in decay)

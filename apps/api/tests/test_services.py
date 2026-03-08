from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.funding_classifier import classify_funding_stage
from app.services.hidden_startup_detector import detect_hidden_signals
from app.services.opportunity_score import compute_opportunity_score
from app.services.resume_matcher import match_resume
from app.services.startup_analyzer import analyze_all_startups


def test_opportunity_score_is_deterministic() -> None:
    score, breakdown, explanations = compute_opportunity_score(
        ai_depth=80, hiring_signal=70, founder_strength=75, market_fit=65
    )
    assert score == 73
    assert breakdown["aiDepth"] == 80
    assert len(explanations) == 4


def test_funding_classifier() -> None:
    assert classify_funding_stage("Pre-seed startup") == "Pre-Seed"
    assert classify_funding_stage("Series A in progress") == "Series A"


def test_hidden_signal_detection_has_reasons() -> None:
    startups = analyze_all_startups()
    signals = detect_hidden_signals(startups)
    assert len(signals) >= 1
    assert all(signal.whyItMatters for signal in signals)


def test_resume_match_outputs_gaps() -> None:
    startup = analyze_all_startups()[0]
    result = match_resume(
        startup,
        resume_text="Built llm automation systems and internal tooling.",
        key_skills=["llm", "automation", "python"],
    )
    assert result.fitScore >= 55
    assert len(result.recommendations) >= 2
    assert result.skillGaps is not None

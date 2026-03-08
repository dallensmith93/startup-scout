from __future__ import annotations

import json
from pathlib import Path

from app.models import Intelligence, StartupRecord
from app.services.founder_signal_tracker import extract_founder_signals
from app.services.funding_classifier import classify_funding_stage
from app.services.hiring_probability import estimate_hiring_probability
from app.services.market_classifier import classify_market
from app.services.opportunity_score import compute_opportunity_score

DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "mock_startups.json"


def _ai_depth(tags: list[str], description: str) -> int:
    text = f"{' '.join(tags)} {description}".lower()
    score = 50
    for token, weight in [("agent", 12), ("llm", 10), ("automation", 8), ("copilot", 10), ("ml", 7), ("recommendation", 6), ("search", 6)]:
        if token in text:
            score += weight
    return min(score, 95)


def _founder_strength(founder_signals: list[str]) -> int:
    base = 58
    return min(94, base + len(founder_signals) * 9)


def _market_fit(category: str, tags: list[str]) -> int:
    score = 62
    if category in {"Developer Tools", "Infrastructure"}:
        score += 10
    if "b2b" in [t.lower() for t in tags]:
        score += 8
    return min(score, 92)


def load_raw_startups() -> list[dict]:
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))


def analyze_startup(raw: dict) -> StartupRecord:
    market = classify_market(raw["tags"], raw["description"])
    funding = classify_funding_stage(raw.get("fundingText", ""))
    hiring_prob = estimate_hiring_probability(raw.get("openRoles", []), raw.get("hiringText", ""))
    founder_signals = extract_founder_signals(raw.get("founderText", ""), raw.get("hiringText", ""))
    ai_depth = _ai_depth(raw["tags"], raw["description"])
    founder_strength = _founder_strength(founder_signals)
    market_fit = _market_fit(market, raw["tags"])

    score, breakdown, explanations = compute_opportunity_score(
        ai_depth=ai_depth,
        hiring_signal=hiring_prob,
        founder_strength=founder_strength,
        market_fit=market_fit,
    )

    intelligence = Intelligence(
        marketCategory=market,
        fundingStage=funding,
        hiringProbability=hiring_prob,
        founderSignals=founder_signals,
        aiFocus=[t for t in raw["tags"] if t.lower() in {"agents", "llm", "copilot", "automation", "ml", "search", "recommendation"}],
        summary=f"{raw['name']} is positioned in {market} with {funding} signals and {hiring_prob}% hiring momentum."
    )

    return StartupRecord(
        id=raw["id"],
        name=raw["name"],
        domain=raw["domain"],
        website=raw["website"],
        location=raw["location"],
        description=raw["description"],
        firstSeenAt=raw["firstSeenAt"],
        tags=raw["tags"],
        openRoles=raw.get("openRoles", []),
        score=score,
        scoreBreakdown=breakdown,
        whyNow=explanations,
        intelligence=intelligence,
    )


def analyze_all_startups() -> list[StartupRecord]:
    return [analyze_startup(item) for item in load_raw_startups()]

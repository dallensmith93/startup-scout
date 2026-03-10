from __future__ import annotations

import os
import json
from pathlib import Path

from app.models import Intelligence, StartupFeedStatus, StartupRecord
from app.services.founder_signal_tracker import extract_founder_signals
from app.services.funding_classifier import classify_funding_stage
from app.services.hiring_probability import estimate_hiring_probability
from app.services.live_job_feed import fetch_latest_ai_jobs_by_company, load_live_startups
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
    live = load_live_startups()
    if live:
        return live
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))


def _merge_live_roles(base_roles: list[str], company_name: str, jobs_by_company: dict[str, list]) -> list[str]:
    merged = list(base_roles)
    seen = {item.lower() for item in merged}
    for job in jobs_by_company.get(company_name.lower(), []):
        role_line = f"{job.title} ({job.source})"
        key = role_line.lower()
        if key in seen:
            continue
        merged.append(role_line)
        seen.add(key)
    return merged[:8]


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
    raws = load_raw_startups()
    rows = [analyze_startup(item) for item in raws]

    live_jobs = fetch_latest_ai_jobs_by_company([row.name for row in rows])
    if not live_jobs.jobs_by_company:
        return rows

    enriched: list[StartupRecord] = []
    for row in rows:
        enriched.append(
            row.model_copy(
                update={
                    "openRoles": _merge_live_roles(
                        row.openRoles,
                        row.name,
                        live_jobs.jobs_by_company,
                    )
                }
            )
        )
    return enriched


def get_startup_feed_status() -> StartupFeedStatus:
    live_startups = load_live_startups()
    live_jobs = fetch_latest_ai_jobs_by_company([item.get("name", "") for item in live_startups] if live_startups else [])
    startup_source = os.getenv("LIVE_STARTUPS_URL", "").strip() or os.getenv("YC_SOURCE_URL", "").strip()
    provider = os.getenv("LIVE_JOB_PROVIDER", "serpapi").strip().lower()
    source = provider if provider and os.getenv("SERPAPI_KEY", "").strip() else "mock"

    if startup_source:
        source = f"{source}+startup-feed"

    reason_parts: list[str] = []
    if startup_source:
        reason_parts.append(f"startup source configured ({len(live_startups)} startup records)")
    else:
        reason_parts.append("startup source not configured; using local startup dataset")

    if provider == "serpapi" and os.getenv("SERPAPI_KEY", "").strip():
        reason_parts.append(
            f"live job provider active with {len(live_jobs.jobs_by_company)} startup-company matches"
        )
    else:
        reason_parts.append("live job provider inactive or missing key; using static roles")

    reason_parts.append(live_jobs.reason)

    return StartupFeedStatus(
        isLiveStartupsEnabled=bool(startup_source),
        isLiveJobsEnabled=provider == "serpapi" and bool(os.getenv("SERPAPI_KEY", "").strip()),
        liveStartupCount=len(live_startups),
        liveJobCompanyCount=len(live_jobs.jobs_by_company),
        source=source,
        reason="; ".join(reason_parts),
        fetchedAt=live_jobs.fetched_at,
    )

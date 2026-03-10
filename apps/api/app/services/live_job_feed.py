from __future__ import annotations

import json
import os
import time
from dataclasses import dataclass
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen


_ALLOWED_SOURCES = ("indeed", "linkedin", "glassdoor")
_CACHE_SECONDS = 900
_CACHE: dict[str, tuple[float, Any]] = {}


@dataclass
class LiveJob:
    title: str
    company: str
    source: str
    posted_at: str


@dataclass
class LiveJobBundle:
    fetched_at: str
    jobs_by_company: dict[str, list[LiveJob]]
    reason: str


def _now_iso() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def _fetch_json(url: str, headers: dict[str, str] | None = None, timeout: float = 8.0) -> Any:
    request = Request(url, headers=headers or {})
    with urlopen(request, timeout=timeout) as response:  # nosec B310
        return json.loads(response.read().decode("utf-8"))


def _cache_get(key: str) -> Any | None:
    record = _CACHE.get(key)
    if not record:
        return None
    created_at, payload = record
    if time.time() - created_at > _CACHE_SECONDS:
        return None
    return payload


def _cache_set(key: str, payload: Any) -> None:
    _CACHE[key] = (time.time(), payload)


def _source_from_via(via: str) -> str | None:
    text = via.lower()
    for source in _ALLOWED_SOURCES:
        if source in text:
            return source
    return None


def _search_serpapi_jobs(query: str, location: str, limit: int) -> list[dict[str, Any]]:
    api_key = os.getenv("SERPAPI_KEY", "").strip()
    if not api_key:
        return []

    cache_key = f"serpapi::{query}::{location}::{limit}"
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    params = {
        "engine": "google_jobs",
        "q": query,
        "location": location,
        "hl": "en",
        "api_key": api_key,
    }
    url = f"https://serpapi.com/search.json?{urlencode(params)}"
    try:
        payload = _fetch_json(url)
    except Exception:
        return []
    rows = payload.get("jobs_results", []) if isinstance(payload, dict) else []
    filtered: list[dict[str, Any]] = []
    for row in rows:
        via = str(row.get("via", ""))
        source = _source_from_via(via)
        if not source:
            continue
        filtered.append(
            {
                "title": str(row.get("title", "")).strip(),
                "company": str(row.get("company_name", "")).strip(),
                "source": source,
                "posted_at": str(row.get("detected_extensions", {}).get("posted_at", "latest")).strip() or "latest",
            }
        )
        if len(filtered) >= limit:
            break

    _cache_set(cache_key, filtered)
    return filtered


def fetch_latest_ai_jobs_by_company(company_names: list[str]) -> LiveJobBundle:
    provider = os.getenv("LIVE_JOB_PROVIDER", "serpapi").strip().lower()
    if provider != "serpapi":
        return LiveJobBundle(
            fetched_at=_now_iso(),
            jobs_by_company={},
            reason="Live job provider disabled or unsupported; using static startup roles.",
        )

    limit = int(os.getenv("LIVE_JOB_RESULTS_PER_COMPANY", "3") or "3")
    location = os.getenv("LIVE_JOB_LOCATION", "United States")

    jobs_by_company: dict[str, list[LiveJob]] = {}
    for company in company_names:
        query = f"{company} AI OR ML engineer"
        rows = _search_serpapi_jobs(query=query, location=location, limit=limit)
        mapped = [
            LiveJob(
                title=row["title"],
                company=row["company"],
                source=row["source"],
                posted_at=row["posted_at"],
            )
            for row in rows
            if row.get("title")
        ]
        if mapped:
            jobs_by_company[company.lower()] = mapped

    if not jobs_by_company:
        return LiveJobBundle(
            fetched_at=_now_iso(),
            jobs_by_company={},
            reason="No live jobs found from Indeed/LinkedIn/Glassdoor sources for configured startup list.",
        )

    return LiveJobBundle(
        fetched_at=_now_iso(),
        jobs_by_company=jobs_by_company,
        reason="Live AI jobs ingested via SerpAPI Google Jobs and filtered to Indeed/LinkedIn/Glassdoor sources.",
    )


def load_live_startups() -> list[dict[str, Any]]:
    source_url = os.getenv("LIVE_STARTUPS_URL", "").strip() or os.getenv("YC_SOURCE_URL", "").strip()
    if not source_url:
        return []

    cache_key = f"startups::{source_url}"
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    try:
        payload = _fetch_json(source_url)
    except Exception:
        return []
    rows = payload if isinstance(payload, list) else payload.get("startups", []) if isinstance(payload, dict) else []
    normalized: list[dict[str, Any]] = []
    for idx, row in enumerate(rows):
        if not isinstance(row, dict):
            continue
        name = str(row.get("name", "")).strip()
        website = str(row.get("website", "")).strip()
        if not name or not website:
            continue
        domain = website.replace("https://", "").replace("http://", "").split("/")[0]
        normalized.append(
            {
                "id": str(row.get("id", f"live-{idx}")),
                "name": name,
                "domain": domain,
                "website": website,
                "location": str(row.get("location", "Remote")),
                "description": str(row.get("description", "AI startup opportunity.")),
                "firstSeenAt": str(row.get("firstSeenAt", _now_iso())),
                "tags": row.get("tags", ["ai", "startup"]),
                "openRoles": row.get("openRoles", []),
                "hiringText": str(row.get("hiringText", "Hiring signals detected.")),
                "fundingText": str(row.get("fundingText", "Early-stage startup.")),
                "founderText": str(row.get("founderText", "Founder-led team.")),
            }
        )

    _cache_set(cache_key, normalized)
    return normalized

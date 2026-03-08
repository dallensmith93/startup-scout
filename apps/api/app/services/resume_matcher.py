from __future__ import annotations

from app.models import ResumeMatchResponse, StartupRecord


def match_resume(startup: StartupRecord, resume_text: str, key_skills: list[str]) -> ResumeMatchResponse:
    text = resume_text.lower()
    startup_signals = {s.lower() for s in startup.tags + startup.intelligence.aiFocus}
    normalized_skills = [s.strip().lower() for s in key_skills if s.strip()]

    matched = [s for s in normalized_skills if s in text or s in startup_signals]
    missing = [s for s in startup_signals if s not in matched][:5]

    base = 45
    fit = min(97, base + len(matched) * 9 + (10 if "founding" in " ".join(startup.openRoles).lower() else 0))

    strengths = [f"Matched signal: {m}" for m in matched[:5]] or ["General AI product alignment from resume narrative"]
    gaps = [f"Develop clearer proof for {g}" for g in missing[:4]] or ["No critical gaps detected"]
    recommendations = [
        "Lead with one quantified project outcome.",
        "Reference direct relevance to startup problem space.",
        "Include one concise technical architecture example."
    ]

    return ResumeMatchResponse(fitScore=fit, strengths=strengths, skillGaps=gaps, recommendations=recommendations)

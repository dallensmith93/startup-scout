from __future__ import annotations

from app.models.application import FitCategory, KeywordGapReport
from app.services.keyword_gap_analyzer import analyze_keyword_gap


def build_fit_summary(
    resume_text: str,
    required_skills: list[str],
    risk_signals: list[str],
) -> tuple[FitCategory, FitCategory, KeywordGapReport, str, list[str]]:
    matched, missing, overlap = analyze_keyword_gap(resume_text, required_skills)

    fit_score = min(95, max(35, 40 + overlap // 2 + len(matched) * 4))
    risk_score = min(90, max(20, 25 + len(risk_signals) * 12 + max(0, 3 - len(matched)) * 6))

    fit = FitCategory(
        label="Strong" if fit_score >= 75 else "Moderate" if fit_score >= 55 else "Weak",
        score=fit_score,
        reasoning=[
            f"Matched {len(matched)} of {len(required_skills)} required skills.",
            "Overlap score reflects direct keyword evidence from resume text.",
        ],
    )
    risk = FitCategory(
        label="Elevated" if risk_score >= 70 else "Watch" if risk_score >= 45 else "Low",
        score=risk_score,
        reasoning=[
            "Risk increases when role scope is broad and matched signals are limited.",
            f"Detected role risks: {', '.join(risk_signals[:2]) or 'none explicitly listed'}.",
        ],
    )

    gap = KeywordGapReport(
        matchedKeywords=matched[:8],
        missingKeywords=missing[:8],
        overlapScore=overlap,
    )

    strongest = (
        f"Your strongest signal is demonstrated capability in {matched[0]}."
        if matched
        else "Your strongest signal is adaptability; add one concrete AI delivery example to strengthen fit."
    )

    bullets = [
        f"Led {skill}-driven feature delivery with measurable user impact and clear ownership."
        for skill in (matched[:3] or missing[:3])
    ]

    return fit, risk, gap, strongest, bullets

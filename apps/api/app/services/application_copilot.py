from __future__ import annotations

from app.models.application import ApplicationFitResponse
from app.models.tailoring import TailoringAnalyzeResponse
from app.services.fit_summary_builder import build_fit_summary
from app.services.next_step_recommender import build_next_step
from app.services.resume_tailor_engine import build_intro, build_resume_diff, suggest_bullets


def build_application_fit(
    application_id: str,
    startup_name: str,
    role_title: str,
    status: str,
    required_skills: list[str],
    risk_signals: list[str],
    resume_text: str,
) -> ApplicationFitResponse:
    fit, risk, gap, strongest, bullets = build_fit_summary(resume_text, required_skills, risk_signals)
    intro = build_intro(startup_name, role_title, gap.matchedKeywords)
    next_step = build_next_step(fit.score, risk.score, gap.missingKeywords, status)

    return ApplicationFitResponse(
        applicationId=application_id,
        fitScore=fit.score,
        fitSummary=fit,
        riskSummary=risk,
        keywordGapReport=gap,
        tailoredIntroParagraph=intro,
        tailoredResumeBullets=bullets,
        strongestRelevantExperience=strongest,
        recommendedNextStep=next_step,
        evidence={
            "matchedKeywords": gap.matchedKeywords,
            "missingKeywords": gap.missingKeywords,
            "riskSignals": risk_signals,
            "status": status,
        },
        reasoning=[
            "Fit and risk scores are deterministic based on keyword overlap and role-risk signals.",
            "Next step recommendation is status-aware and optimized for fastest progress.",
        ],
    )


def build_tailoring_payload(
    application_id: str,
    startup_name: str,
    role_title: str,
    required_skills: list[str],
    risk_signals: list[str],
    resume_text: str,
    current_bullets: list[str],
) -> TailoringAnalyzeResponse:
    fit, _, gap, strongest, _ = build_fit_summary(resume_text, required_skills, risk_signals)
    suggested = suggest_bullets(gap.matchedKeywords, gap.missingKeywords)
    intro = build_intro(startup_name, role_title, gap.matchedKeywords)
    diff = build_resume_diff(current_bullets, suggested)

    return TailoringAnalyzeResponse(
        applicationId=application_id,
        matchScore=fit.score,
        keywordAnalysis=[
            f"Matched: {item}" for item in gap.matchedKeywords[:4]
        ] + [f"Missing: {item}" for item in gap.missingKeywords[:4]],
        tailoredIntroParagraph=intro,
        suggestedBullets=suggested,
        resumeDiffSummary=diff,
        keywordGapReport=gap,
        strongestRelevantExperience=strongest,
        reasoning=[
            f"Tailoring anchored on fit score {fit.score} and missing keyword set.",
            "Bullet suggestions bias toward measurable impact statements.",
        ],
    )

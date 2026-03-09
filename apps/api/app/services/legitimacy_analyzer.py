import hashlib

from .company_surface_checker import check_company_surface
from .compensation_risk_checker import compensation_risk_flags
from .domain_consistency_checker import domain_consistency_score
from .legitimacy_explainer import explain_legitimacy
from .posting_quality_checker import posting_quality_score
from .recruiter_message_analyzer import analyze_recruiter_message
from .scam_signal_engine import detect_scam_signals


FOLLOWUP_QUESTIONS = [
    "Can you share the official role requisition ID and careers-page link?",
    "Can you confirm expected interview stages and timeline?",
    "Who will be the hiring manager and what email domain will they use?",
]


def _risk_label(score: int) -> str:
    if score <= 25:
        return "low"
    if score <= 45:
        return "moderate"
    if score <= 70:
        return "elevated"
    return "high"


def analyze_legitimacy(
    *,
    job_title: str,
    company_name: str,
    job_description: str,
    salary_range: str | None,
    recruiter_message: str | None,
    posting_url: str | None,
    company_website: str | None,
    notes: str | None,
) -> dict:
    combined = " ".join([
        job_title,
        company_name,
        job_description,
        recruiter_message or "",
        posting_url or "",
        company_website or "",
        notes or "",
    ])

    scam_flags = detect_scam_signals(combined)
    quality_score, quality_trust = posting_quality_score(job_description, salary_range)
    comp_flags = compensation_risk_flags(salary_range, combined)
    recruiter = analyze_recruiter_message(recruiter_message or "") if recruiter_message else {
        "authenticityScore": 70,
        "riskLevel": "moderate",
        "confidence": 0.55,
        "trustSignals": [],
        "redFlags": [],
        "explanationSummary": "Recruiter message not provided.",
        "followupQuestions": FOLLOWUP_QUESTIONS,
    }

    website = company_website or ""
    domain = website.replace("https://", "").replace("http://", "").split("/")[0] if website else company_name.lower().replace(" ", "") + ".com"
    company_surface = check_company_surface(company_name, website or f"https://{domain}", posting_url)
    consistency = domain_consistency_score(company_name, domain)

    trust_signals = quality_trust + recruiter["trustSignals"] + company_surface["surfaceSignals"]
    red_flags = scam_flags + comp_flags + recruiter["redFlags"] + company_surface["redFlags"]

    scam_risk = min(100, len(scam_flags) * 18 + len(comp_flags) * 10 + len(recruiter["redFlags"]) * 14)

    legitimacy_score = round(
        quality_score * 0.34
        + consistency * 0.22
        + recruiter["authenticityScore"] * 0.24
        + max(0, 100 - scam_risk) * 0.20
    )
    legitimacy_score = max(0, min(100, legitimacy_score))

    risk_level = _risk_label(scam_risk)
    confidence = round(max(0.35, min(0.96, (quality_score + consistency + recruiter["authenticityScore"]) / 300)), 2)

    summary, action = explain_legitimacy(legitimacy_score, scam_risk, red_flags, trust_signals)

    report_id = hashlib.sha1(f"{job_title}|{company_name}|{posting_url or ''}".encode("utf-8")).hexdigest()[:12]

    return {
        "reportId": report_id,
        "legitimacyScore": legitimacy_score,
        "scamRiskScore": scam_risk,
        "confidence": confidence,
        "riskLevel": risk_level,
        "trustSignals": sorted(set(trust_signals)),
        "redFlags": sorted(set(red_flags)),
        "explanationSummary": summary,
        "recommendedAction": action,
        "suggestedFollowupQuestions": FOLLOWUP_QUESTIONS,
        "evidence": {
            "scoreBreakdown": {
                "postingQuality": quality_score,
                "domainConsistency": consistency,
                "recruiterAuthenticity": recruiter["authenticityScore"],
                "inverseScamRisk": max(0, 100 - scam_risk),
            },
            "positiveEvidence": sorted(set(trust_signals)),
            "riskEvidence": sorted(set(red_flags)),
        },
    }

from fastapi import APIRouter

from app.models.company_check import CompanyCheckRequest, CompanyCheckResponse
from app.services.company_surface_checker import check_company_surface
from app.services.domain_consistency_checker import domain_consistency_score

router = APIRouter(prefix="/company-check", tags=["company-check"])


def _risk_label(score: int) -> str:
    if score >= 80:
        return "low"
    if score >= 65:
        return "moderate"
    if score >= 45:
        return "elevated"
    return "high"


@router.post("/analyze", response_model=CompanyCheckResponse)
def analyze(payload: CompanyCheckRequest) -> CompanyCheckResponse:
    surface = check_company_surface(payload.companyName, payload.website, payload.postingUrl)
    consistency = domain_consistency_score(payload.companyName, payload.domain)
    domain_trust = min(100, consistency + (10 if payload.website.startswith("https://") else 0))
    legitimacy = round(domain_trust * 0.6 + consistency * 0.4)
    risk = _risk_label(legitimacy)

    summary = (
        "Company surface appears credible with good domain alignment."
        if risk in {"low", "moderate"}
        else "Company surface evidence is mixed; verify domain ownership and official posting source."
    )
    action = (
        "Proceed and validate interviewer identity in the first call."
        if risk in {"low", "moderate"}
        else "Pause and verify the company domain, recruiter email, and posting source."
    )

    return CompanyCheckResponse(
        legitimacyScore=legitimacy,
        domainTrust=domain_trust,
        consistencyScore=consistency,
        confidence=round(max(0.4, min(0.95, legitimacy / 100)), 2),
        riskLevel=risk,
        surfaceSignals=surface["surfaceSignals"],
        redFlags=surface["redFlags"],
        explanationSummary=summary,
        recommendedAction=action,
    )

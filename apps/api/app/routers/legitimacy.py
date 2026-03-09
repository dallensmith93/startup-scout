from fastapi import APIRouter

from app.models.legitimacy import LegitimacyRequest, LegitimacyResponse
from app.services.legitimacy_analyzer import analyze_legitimacy

router = APIRouter(prefix="/legitimacy", tags=["legitimacy"])


@router.post("/analyze", response_model=LegitimacyResponse)
def analyze(payload: LegitimacyRequest) -> LegitimacyResponse:
    result = analyze_legitimacy(
        job_title=payload.jobTitle,
        company_name=payload.companyName,
        job_description=payload.jobDescription,
        salary_range=payload.salaryRange,
        recruiter_message=payload.recruiterMessage,
        posting_url=payload.postingUrl,
        company_website=payload.companyWebsite,
        notes=payload.notes,
    )
    return LegitimacyResponse(**result)

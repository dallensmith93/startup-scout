from fastapi import APIRouter

from app.models.recruiter_check import RecruiterCheckRequest, RecruiterCheckResponse
from app.services.recruiter_message_analyzer import analyze_recruiter_message

router = APIRouter(prefix="/recruiter-check", tags=["recruiter-check"])


@router.post("/analyze", response_model=RecruiterCheckResponse)
def analyze(payload: RecruiterCheckRequest) -> RecruiterCheckResponse:
    return RecruiterCheckResponse(
        **analyze_recruiter_message(payload.message, payload.recruiterEmail)
    )

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models.interview_prep import InterviewPrepRequest, InterviewPrepResponse
from app.services.application_tracker import load_applications
from app.services.interview_prep_generator import generate_interview_prep

router = APIRouter(prefix="/interview-prep", tags=["interview-prep"])


@router.post("/generate", response_model=InterviewPrepResponse)
def generate(request: InterviewPrepRequest) -> InterviewPrepResponse:
    app = next((row for row in load_applications() if row.id == request.applicationId), None)
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")

    return generate_interview_prep(
        application_id=app.id,
        startup_name=app.startupName,
        role_title=app.roleTitle,
        resume_text=request.resumeText,
        required_skills=app.requiredSkills,
        focus_areas=request.focusAreas,
    )

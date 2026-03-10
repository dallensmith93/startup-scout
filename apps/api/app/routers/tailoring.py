from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models.tailoring import TailoringAnalyzeRequest, TailoringAnalyzeResponse
from app.services.application_copilot import build_tailoring_payload
from app.services.application_tracker import load_applications

router = APIRouter(prefix="/tailoring", tags=["tailoring"])


@router.post("/analyze", response_model=TailoringAnalyzeResponse)
def analyze_tailoring(request: TailoringAnalyzeRequest) -> TailoringAnalyzeResponse:
    app = next((row for row in load_applications() if row.id == request.applicationId), None)
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")

    return build_tailoring_payload(
        application_id=app.id,
        startup_name=app.startupName,
        role_title=app.roleTitle,
        required_skills=list(dict.fromkeys(app.requiredSkills + request.keySkills)),
        risk_signals=app.riskSignals,
        resume_text=request.resumeText,
        current_bullets=request.currentBullets,
    )

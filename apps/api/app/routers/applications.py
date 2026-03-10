from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models.application import ApplicationFitRequest, ApplicationFitResponse, ApplicationRecord
from app.services.application_copilot import build_application_fit
from app.services.application_tracker import load_applications

router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("", response_model=list[ApplicationRecord])
def list_applications() -> list[ApplicationRecord]:
    return load_applications()


@router.get("/{application_id}", response_model=ApplicationRecord)
def get_application(application_id: str) -> ApplicationRecord:
    app = next((row for row in load_applications() if row.id == application_id), None)
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return app


@router.post("/{application_id}/fit-summary", response_model=ApplicationFitResponse)
def fit_summary(application_id: str, request: ApplicationFitRequest) -> ApplicationFitResponse:
    app = next((row for row in load_applications() if row.id == application_id), None)
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")

    return build_application_fit(
        application_id=app.id,
        startup_name=app.startupName,
        role_title=app.roleTitle,
        status=app.status,
        required_skills=list(dict.fromkeys(app.requiredSkills + request.keySkills)),
        risk_signals=app.riskSignals,
        resume_text=request.resumeText,
    )

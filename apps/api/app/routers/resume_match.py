from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models import ResumeMatchRequest, ResumeMatchResponse
from app.services.resume_matcher import match_resume
from app.services.startup_analyzer import analyze_all_startups

router = APIRouter(prefix="/resume-match", tags=["resume-match"])


@router.post("/analyze", response_model=ResumeMatchResponse)
def analyze(request: ResumeMatchRequest) -> ResumeMatchResponse:
    startup = next((s for s in analyze_all_startups() if s.id == request.startupId), None)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    return match_resume(startup, request.resumeText, request.keySkills)

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models import OutreachRequest, OutreachResponse
from app.services.outreach_generator import generate_outreach
from app.services.startup_analyzer import analyze_all_startups

router = APIRouter(prefix="/outreach", tags=["outreach"])


@router.post("/generate", response_model=OutreachResponse)
def generate(request: OutreachRequest) -> OutreachResponse:
    startup = next((s for s in analyze_all_startups() if s.id == request.startupId), None)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    return generate_outreach(startup, request.candidateName, request.candidatePitch, request.tone)

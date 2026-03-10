from __future__ import annotations

from fastapi import APIRouter

from app.models.outreach import OutreachHubResponse
from app.services.message_strategy_engine import build_outreach_hub

router = APIRouter(prefix="/outreach-hub", tags=["outreach-hub"])


@router.get("", response_model=OutreachHubResponse)
def outreach_hub() -> OutreachHubResponse:
    return build_outreach_hub()

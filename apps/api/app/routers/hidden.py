from __future__ import annotations

from fastapi import APIRouter

from app.models import HiddenSignal
from app.services.hidden_startup_detector import detect_hidden_signals
from app.services.startup_analyzer import analyze_all_startups

router = APIRouter(prefix="/hidden-startups", tags=["hidden-startups"])


@router.get("", response_model=list[HiddenSignal])
def hidden_startups() -> list[HiddenSignal]:
    return detect_hidden_signals(analyze_all_startups())

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models import StartupRecord
from app.services.startup_analyzer import analyze_all_startups

router = APIRouter(prefix="/startups", tags=["startups"])


@router.get("", response_model=list[StartupRecord])
def list_startups() -> list[StartupRecord]:
    rows = analyze_all_startups()
    return sorted(rows, key=lambda x: x.score, reverse=True)


@router.get("/{startup_id}", response_model=StartupRecord)
def get_startup(startup_id: str) -> StartupRecord:
    for item in analyze_all_startups():
        if item.id == startup_id:
            return item
    raise HTTPException(status_code=404, detail="Startup not found")

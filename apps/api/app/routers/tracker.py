from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models.tracker import (
    FollowupListResponse,
    TrackerItem,
    TrackerListResponse,
    TrackerUpdateRequest,
    TrackerUpdateResponse,
)
from app.services.application_tracker import list_tracker_items, update_tracker_status
from app.services.followup_planner import generate_followups

router = APIRouter(prefix="/tracker", tags=["tracker"])


@router.get("", response_model=TrackerListResponse)
def get_tracker() -> TrackerListResponse:
    items = list_tracker_items()
    return TrackerListResponse(total=len(items), items=items)


@router.post("/update", response_model=TrackerUpdateResponse)
def update_tracker(request: TrackerUpdateRequest) -> TrackerUpdateResponse:
    if not any(item.applicationId == request.applicationId for item in list_tracker_items()):
        raise HTTPException(status_code=404, detail="Application not found")
    items = update_tracker_status(request.applicationId, request.stage, request.note)
    item = next(row for row in items if row.applicationId == request.applicationId)
    return TrackerUpdateResponse(item=item)


@router.get("/followups", response_model=FollowupListResponse)
def followups() -> FollowupListResponse:
    return FollowupListResponse(items=generate_followups(list_tracker_items()))

from __future__ import annotations

from fastapi import APIRouter

from app.models.relationship_health import RelationshipHealthResponse
from app.services.relationship_health_engine import build_relationship_health

router = APIRouter(prefix="/relationship-health", tags=["relationship-health"])


@router.get("", response_model=RelationshipHealthResponse)
def relationship_health() -> RelationshipHealthResponse:
    return build_relationship_health()

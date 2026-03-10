from __future__ import annotations

from fastapi import APIRouter

from app.models.connection import ConnectionsResponse
from app.services.networking_pipeline import build_connections_board

router = APIRouter(prefix="/connections", tags=["connections"])


@router.get("", response_model=ConnectionsResponse)
def connections() -> ConnectionsResponse:
    return build_connections_board()

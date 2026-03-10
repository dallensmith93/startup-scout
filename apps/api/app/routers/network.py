from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models.contact import ContactDetailResponse, ContactListResponse
from app.services.contact_intelligence import get_contact, list_contacts

router = APIRouter(prefix="/network", tags=["network"])


@router.get("", response_model=ContactListResponse)
def network() -> ContactListResponse:
    return list_contacts()


@router.get("/{contact_id}", response_model=ContactDetailResponse)
def network_contact(contact_id: str) -> ContactDetailResponse:
    try:
        return get_contact(contact_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

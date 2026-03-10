from __future__ import annotations

from datetime import UTC, datetime, timedelta
import json
from pathlib import Path

from app.models.application import ApplicationRecord
from app.models.tracker import TrackerItem

DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "mock_applications.json"
_TRACKER_OVERRIDES: dict[str, dict[str, str]] = {}


def load_applications() -> list[ApplicationRecord]:
    rows = json.loads(DATA_FILE.read_text(encoding="utf-8-sig"))
    return [ApplicationRecord.model_validate(item) for item in rows]


def list_tracker_items() -> list[TrackerItem]:
    items = []
    for app in load_applications():
        override = _TRACKER_OVERRIDES.get(app.id, {})
        status = override.get("status", app.status)
        stage = override.get("stage", app.stage)
        updated_at = override.get("updatedAt", app.lastTouchAt)
        note = override.get("note", "")
        items.append(
            TrackerItem(
                applicationId=app.id,
                startupName=app.startupName,
                roleTitle=app.roleTitle,
                status=status,
                stage=stage,
                note=note,
                updatedAt=updated_at,
                nextAction=_default_next_action(status),
            )
        )
    return items


def _default_next_action(status: str) -> str:
    mapping = {
        "saved": "Tailor resume bullets to role language",
        "tailoring": "Finalize intro and submit application",
        "applied": "Send follow-up with one quantified achievement",
        "interview": "Prepare targeted project narratives",
        "offer": "Prepare comp and scope questions",
        "rejected": "Archive learnings and move on",
    }
    return mapping.get(status, "Review and decide next action")


def update_tracker_status(application_id: str, stage: str, note: str = "") -> list[TrackerItem]:
    updated_at = datetime.now(UTC).strftime("%Y-%m-%d")
    status = "interview" if stage.lower() in {"screening", "interview"} else "applied"
    _TRACKER_OVERRIDES[application_id] = {
        "status": status,
        "stage": stage,
        "updatedAt": updated_at,
        "note": note,
    }
    return list_tracker_items()


def days_since(date_str: str) -> int:
    day = datetime.strptime(date_str, "%Y-%m-%d")
    return max(0, (datetime.now(UTC).replace(tzinfo=None) - day).days)


def should_follow_up(updated_at: str, status: str) -> bool:
    age = days_since(updated_at)
    return status in {"applied", "interview"} and age >= 5


def followup_due_date(updated_at: str) -> str:
    day = datetime.strptime(updated_at, "%Y-%m-%d") + timedelta(days=5)
    return day.strftime("%Y-%m-%d")

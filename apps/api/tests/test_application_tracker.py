from datetime import UTC, datetime, timedelta
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.application_tracker import list_tracker_items, update_tracker_status
from app.services.application_tracker import followup_due_date, should_follow_up


def test_tracker_lists_items() -> None:
    items = list_tracker_items()
    assert len(items) >= 2
    assert all(item.applicationId for item in items)


def test_tracker_update_status_changes_target_item() -> None:
    items = list_tracker_items()
    target = items[0]
    updated = update_tracker_status(target.applicationId, "screening", "Recruiter replied")
    row = next(item for item in updated if item.applicationId == target.applicationId)
    assert row.stage == "screening"
    assert row.nextAction


def test_tracker_followup_threshold_behavior() -> None:
    five_days_ago = (datetime.now(UTC) - timedelta(days=5)).strftime("%Y-%m-%d")
    four_days_ago = (datetime.now(UTC) - timedelta(days=4)).strftime("%Y-%m-%d")

    assert should_follow_up(five_days_ago, "applied")
    assert not should_follow_up(four_days_ago, "applied")
    assert not should_follow_up(five_days_ago, "saved")


def test_tracker_followup_due_date_is_five_days_after_last_touch() -> None:
    assert followup_due_date("2026-03-04") == "2026-03-09"

from __future__ import annotations

from fastapi import APIRouter

from app.models.tasks import TasksResponse
from app.services.dashboard_aggregator import load_search_state
from app.services.task_generator import generate_tasks

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=TasksResponse)
def tasks() -> TasksResponse:
    return generate_tasks(load_search_state())

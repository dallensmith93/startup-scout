from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.task_generator import generate_tasks
from app.services.dashboard_aggregator import load_search_state


def test_task_generator_includes_reasoned_items() -> None:
    tasks = generate_tasks(load_search_state())
    assert len(tasks.items) >= 1
    assert all(item.reason for item in tasks.items)
    assert all(f.reason for f in tasks.followups)


def test_task_generator_builds_action_queue_from_followups_and_bottlenecks() -> None:
    state = load_search_state()
    tasks = generate_tasks(state)

    followup_actions = [item for item in tasks.actionQueue if item.id.startswith("action-followup-")]
    decay_actions = [item for item in tasks.actionQueue if item.id.startswith("action-decay-")]
    bottleneck_actions = [item for item in tasks.actionQueue if item.id.startswith("action-bottleneck-")]

    assert len(followup_actions) == len(tasks.followups)
    assert len(bottleneck_actions) >= 1
    assert all(item.linkedApplicationId for item in followup_actions)
    assert all(item.urgency in {"critical", "high"} for item in followup_actions)
    assert all(item.urgency in {"critical", "high", "medium"} for item in decay_actions)
    assert all(item.category == "action-queue" for item in tasks.items)

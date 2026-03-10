from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.resume_tailor_engine import build_resume_diff, suggest_bullets


def test_resume_tailor_suggests_for_missing_and_matched() -> None:
    bullets = suggest_bullets(["react"], ["llm"])
    assert any("react" in b.lower() for b in bullets)
    assert any("llm" in b.lower() for b in bullets)


def test_resume_diff_includes_replace_and_add() -> None:
    current = ["Built internal tooling"]
    suggested = [
        "Drove react initiatives from discovery to launch, improving delivery speed and user outcomes.",
        "Drove llm initiatives from discovery to launch, improving delivery speed and user outcomes.",
    ]
    diff = build_resume_diff(current, suggested)
    assert any("Replace bullet 1" in line for line in diff)
    assert any("Add bullet" in line for line in diff)

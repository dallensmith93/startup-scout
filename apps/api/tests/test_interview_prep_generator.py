from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.interview_prep_generator import generate_interview_prep


def test_interview_prep_returns_actionable_sections() -> None:
    prep = generate_interview_prep(
        application_id="app_1",
        startup_name="NovaRelay",
        role_title="Founding Product Engineer",
        resume_text="Built React and Python LLM workflows with measurable outcomes.",
        required_skills=["react", "python", "llm", "experimentation"],
    )

    assert len(prep.talkingPoints) >= 3
    assert len(prep.likelyQuestions) >= 3
    assert len(prep.questionsToAskEmployer) >= 3
    assert prep.reasoning

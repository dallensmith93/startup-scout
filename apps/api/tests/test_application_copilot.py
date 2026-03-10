from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.application_copilot import build_application_fit


def test_application_copilot_fit_is_stable() -> None:
    result = build_application_fit(
        application_id="app_1",
        startup_name="NovaRelay",
        role_title="Founding Product Engineer",
        status="saved",
        required_skills=["react", "typescript", "python", "llm"],
        risk_signals=["high ownership scope"],
        resume_text="Built React TypeScript products and Python APIs with LLM workflows.",
    )

    assert result.fitSummary.score >= 70
    assert result.keywordGapReport.overlapScore >= 50
    assert "NovaRelay" in result.tailoredIntroParagraph
    assert len(result.tailoredResumeBullets) >= 2
    assert result.recommendedNextStep

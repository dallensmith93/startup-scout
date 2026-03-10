from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.keyword_gap_analyzer import analyze_keyword_gap


def test_keyword_gap_low_overlap_case() -> None:
    matched, missing, overlap = analyze_keyword_gap(
        "Managed customer onboarding and account planning.",
        ["python", "react", "llm", "search"],
    )

    assert matched == []
    assert len(missing) == 4
    assert overlap == 0


def test_keyword_gap_detects_overlap() -> None:
    matched, missing, overlap = analyze_keyword_gap(
        "Shipped react interfaces and python APIs for search features.",
        ["python", "react", "llm", "search"],
    )

    assert set(["python", "react", "search"]).issubset(set(matched))
    assert "llm" in missing
    assert overlap >= 50

from app.services.recruiter_message_analyzer import analyze_recruiter_message


def test_recruiter_message_analyzer_output() -> None:
    data = analyze_recruiter_message("Please move to whatsapp only")
    assert "authenticityScore" in data
    assert data["riskLevel"] in {"low", "moderate", "elevated", "high"}
    assert isinstance(data["followupQuestions"], list)


def test_recruiter_message_analyzer_positive_message() -> None:
    data = analyze_recruiter_message("Interview scheduling will happen on our official company calendar.")
    assert data["authenticityScore"] >= 70

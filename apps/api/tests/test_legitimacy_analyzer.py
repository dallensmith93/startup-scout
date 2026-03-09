from app.services.legitimacy_analyzer import analyze_legitimacy


def test_legitimacy_analyzer_has_required_fields() -> None:
    result = analyze_legitimacy(
        job_title="Software Engineer",
        company_name="Acme AI",
        job_description="Responsibilities, requirements, and interview process are clearly listed.",
        salary_range="$140k-$175k",
        recruiter_message="Interview panel includes hiring manager and staff engineer.",
        posting_url="https://acme.ai/careers/123",
        company_website="https://acme.ai",
        notes="",
    )
    assert 0 <= result["legitimacyScore"] <= 100
    assert 0 <= result["scamRiskScore"] <= 100
    assert result["riskLevel"] in {"low", "moderate", "elevated", "high"}
    assert "scoreBreakdown" in result["evidence"]
    assert isinstance(result["suggestedFollowupQuestions"], list)


def test_legitimacy_analyzer_flags_high_risk_pattern() -> None:
    result = analyze_legitimacy(
        job_title="Remote Assistant",
        company_name="Unknown Corp",
        job_description="No interview required. Send urgent payment and gift card.",
        salary_range="",
        recruiter_message="Move to whatsapp only and send crypto",
        posting_url="http://random-link.biz/job",
        company_website="http://random-link.biz",
        notes="",
    )
    assert result["scamRiskScore"] >= 50
    assert len(result["redFlags"]) >= 2

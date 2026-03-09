def posting_quality_score(description: str, salary_range: str | None) -> tuple[int, list[str]]:
    score = 45
    trust: list[str] = []
    lowered = description.lower()

    if len(description) >= 350:
        score += 20
        trust.append("Detailed role description")
    elif len(description) >= 180:
        score += 12
        trust.append("Reasonable level of role detail")

    for keyword, boost, label in [
        ("responsibilities", 8, "Responsibilities outlined"),
        ("requirements", 8, "Requirements listed"),
        ("interview", 6, "Interview process mentioned"),
        ("benefits", 5, "Benefits transparency present"),
    ]:
        if keyword in lowered:
            score += boost
            trust.append(label)

    if salary_range and salary_range.strip():
        score += 10
        trust.append("Salary range provided")

    return min(score, 100), trust

def compensation_risk_flags(salary_range: str | None, text: str) -> list[str]:
    lowered = f"{salary_range or ''} {text}".lower()
    flags: list[str] = []

    if "commission only" in lowered:
        flags.append("Commission-only compensation without clear base pay")
    if "pay to apply" in lowered or "application fee" in lowered:
        flags.append("Payment requested from candidate")
    if "training fee" in lowered:
        flags.append("Training fee language detected")
    if not salary_range or not salary_range.strip():
        flags.append("Compensation details are missing or unclear")

    return flags

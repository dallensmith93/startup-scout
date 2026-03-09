from app.services.compensation_risk_checker import compensation_risk_flags


def test_compensation_risk_flags_detect_payment_pattern() -> None:
    flags = compensation_risk_flags("", "This role requires a training fee and pay to apply")
    assert len(flags) >= 2


def test_compensation_risk_flags_clean_case() -> None:
    flags = compensation_risk_flags("$120k-$150k", "Base salary and equity discussed in final interview")
    assert all("missing" not in f.lower() for f in flags)

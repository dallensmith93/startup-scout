def explain_legitimacy(score: int, scam_risk: int, red_flags: list[str], trust_signals: list[str]) -> tuple[str, str]:
    if score >= 80 and scam_risk <= 30:
        summary = "This posting shows several healthy legitimacy indicators and limited risk signals."
        action = "Proceed, but still verify recruiter identity before sharing sensitive information."
    elif score >= 65 and scam_risk <= 45:
        summary = "This posting appears reasonably credible with some items worth verifying."
        action = "Continue with caution and ask targeted follow-up questions."
    elif score >= 45:
        summary = "This posting has mixed quality and elevated risk indicators."
        action = "Pause and verify domain, recruiter identity, and interview process before moving forward."
    else:
        summary = "This posting has multiple high-risk indicators and low trust evidence."
        action = "Treat this as high risk and proceed only after strong independent verification."

    if red_flags and not trust_signals:
        summary += " Risk signals dominate available evidence."
    elif trust_signals and not red_flags:
        summary += " Positive trust evidence is currently stronger than risk indicators."

    return summary, action

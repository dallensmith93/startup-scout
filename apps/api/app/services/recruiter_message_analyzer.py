def analyze_recruiter_message(message: str, recruiter_email: str | None = None) -> dict:
    lowered = message.lower()
    red_flags: list[str] = []
    trust: list[str] = []

    for token, label in [
        ("whatsapp only", "Requests moving communication to unverified channel"),
        ("urgent payment", "Requests urgent payment"),
        ("gift card", "Mentions gift card payment"),
        ("crypto", "Requests crypto transfer"),
        ("no interview", "Promises hiring without normal process"),
    ]:
        if token in lowered:
            red_flags.append(label)

    if "official" in lowered or "hiring manager" in lowered:
        trust.append("References official hiring process")
    if "calendar" in lowered or "interview" in lowered:
        trust.append("Mentions structured interview scheduling")
    if recruiter_email and not recruiter_email.lower().endswith((".com", ".io", ".ai", ".org")):
        red_flags.append("Email domain appears unusual")

    authenticity = max(8, 88 - len(red_flags) * 18 + len(trust) * 6)
    if authenticity >= 80:
        risk = "low"
    elif authenticity >= 65:
        risk = "moderate"
    elif authenticity >= 45:
        risk = "elevated"
    else:
        risk = "high"

    followups = [
        "Can you share the official company email domain and role requisition ID?",
        "Can you confirm interview stages and who the interviewer will be?",
        "Can you provide the role listing URL on the company careers site?",
    ]

    summary = "Message appears mostly legitimate." if not red_flags else "Message includes signals that require verification before proceeding."

    return {
        "authenticityScore": authenticity,
        "riskLevel": risk,
        "confidence": round(max(0.35, min(0.95, authenticity / 100)), 2),
        "trustSignals": trust,
        "redFlags": red_flags,
        "explanationSummary": summary,
        "followupQuestions": followups,
    }

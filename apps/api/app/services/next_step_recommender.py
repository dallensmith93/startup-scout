from __future__ import annotations


def build_next_step(fit_score: int, risk_score: int, missing_keywords: list[str], status: str) -> str:
    if status in {"saved", "tailoring"}:
        if fit_score >= 70 and risk_score < 65:
            return "Submit the application now, then schedule a focused founder-note follow-up within 48 hours."
        if missing_keywords:
            return f"Tailor resume bullets around {', '.join(missing_keywords[:2])} before submitting."
        return "Finalize tailored intro paragraph and submit application today."

    if status == "applied":
        return "Send a concise follow-up with one quantified project win and explicit role interest."
    if status == "interview":
        return "Prepare STAR stories mapped to role risks and likely execution tradeoffs."
    return "Maintain momentum with weekly pipeline review and targeted outreach."

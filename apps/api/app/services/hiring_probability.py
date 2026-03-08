from __future__ import annotations


def estimate_hiring_probability(open_roles: list[str], hiring_text: str) -> int:
    score = min(len(open_roles) * 18, 54)
    text = hiring_text.lower()
    if "founding" in text:
        score += 20
    if "urgent" in text or "immediately" in text:
        score += 16
    if "early engineering" in text or "first" in text:
        score += 10
    return max(35, min(score, 96))

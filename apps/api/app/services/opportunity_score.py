from __future__ import annotations


def compute_opportunity_score(*, ai_depth: int, hiring_signal: int, founder_strength: int, market_fit: int) -> tuple[int, dict[str, int], list[str]]:
    score = round(ai_depth * 0.3 + hiring_signal * 0.3 + founder_strength * 0.2 + market_fit * 0.2)
    breakdown = {
        "aiDepth": ai_depth,
        "hiringSignal": hiring_signal,
        "founderStrength": founder_strength,
        "marketFit": market_fit,
    }
    explanations = [
        f"AI depth scored {ai_depth}/100 based on product specificity.",
        f"Hiring signal scored {hiring_signal}/100 from role urgency and volume.",
        f"Founder strength scored {founder_strength}/100 from prior execution indicators.",
        f"Market fit scored {market_fit}/100 from category momentum heuristics.",
    ]
    return score, breakdown, explanations

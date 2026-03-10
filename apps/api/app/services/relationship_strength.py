from __future__ import annotations


def relationship_strength(score: int, days_since_touch: int) -> int:
    freshness_penalty = min(25, days_since_touch * 2)
    return max(0, min(100, score - freshness_penalty))


def compute_relationship_strength(base_score: int, days_since_touch: int, stage: str) -> tuple[int, str]:
    adjusted = relationship_strength(base_score, days_since_touch)
    reason = (
        f"Relationship strength starts at {base_score} and applies freshness penalty "
        f"{min(25, days_since_touch * 2)} from {days_since_touch} day(s) since touch in stage '{stage}'."
    )
    return adjusted, reason

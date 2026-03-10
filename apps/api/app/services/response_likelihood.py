from __future__ import annotations


def intro_likelihood(relationship_score: int, stage: str) -> int:
    stage_bonus = {"active": 10, "warm": 6, "new": 2}.get(stage, 0)
    return max(0, min(100, relationship_score + stage_bonus - 8))


def response_likelihood(relationship_score: int, stage: str, last_touch_days: int) -> tuple[int, str]:
    base = intro_likelihood(relationship_score, stage)
    freshness_penalty = min(12, max(0, last_touch_days - 3))
    score = max(0, min(100, base - freshness_penalty))
    reason = (
        f"Base intro likelihood {base} adjusted by freshness penalty {freshness_penalty} for "
        f"{last_touch_days} day(s) since last touch."
    )
    return score, reason


def intro_likelihood_with_reason(relationship_score: int, stage: str, last_touch_days: int) -> tuple[int, str]:
    score = intro_likelihood(relationship_score, stage)
    reason = (
        f"Intro likelihood {score} is computed from relationship score {relationship_score} and stage bonus for '{stage}'."
    )
    return score, reason

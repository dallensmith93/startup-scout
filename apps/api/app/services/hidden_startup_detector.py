from __future__ import annotations

from app.models import HiddenSignal, StartupRecord


def detect_hidden_signals(startups: list[StartupRecord]) -> list[HiddenSignal]:
    signals: list[HiddenSignal] = []
    for startup in startups:
        if startup.intelligence.hiringProbability >= 55 and "Founding" in " ".join(startup.openRoles):
            signals.append(
                HiddenSignal(
                    id=f"hs-{startup.id}-founding",
                    startupId=startup.id,
                    startupName=startup.name,
                    signal="Founding-team hiring with high urgency",
                    confidence=0.86,
                    whyItMatters="Founding roles often give outsized ownership and accelerated career growth."
                )
            )
        if startup.scoreBreakdown.get("marketFit", 0) >= 70 and startup.scoreBreakdown.get("aiDepth", 0) >= 70:
            signals.append(
                HiddenSignal(
                    id=f"hs-{startup.id}-momentum",
                    startupId=startup.id,
                    startupName=startup.name,
                    signal="Strong market + AI depth crossover",
                    confidence=0.81,
                    whyItMatters="This combo signals higher probability of meaningful product pull and learning density."
                )
            )
    return signals

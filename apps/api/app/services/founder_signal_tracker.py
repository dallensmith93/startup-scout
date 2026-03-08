from __future__ import annotations


def extract_founder_signals(founder_text: str, hiring_text: str) -> list[str]:
    text = f"{founder_text} {hiring_text}".lower()
    signals: list[str] = []
    if "ex-" in text:
        signals.append("Founders have prior top-tier operator experience")
    if "second-time" in text:
        signals.append("Repeat founder pattern detected")
    if "founding" in text:
        signals.append("Direct founder hiring signal")
    if "scale" in text:
        signals.append("Execution credibility from prior scale")
    return signals or ["Founders actively recruiting early team"]

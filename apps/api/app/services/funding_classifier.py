from __future__ import annotations


def classify_funding_stage(funding_text: str) -> str:
    text = funding_text.lower()
    if "pre-seed" in text:
        return "Pre-Seed"
    if "series a" in text:
        return "Series A"
    if "seed" in text:
        return "Seed"
    if "bootstrapped" in text:
        return "Bootstrapped"
    return "Early"

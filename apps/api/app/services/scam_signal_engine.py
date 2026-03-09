import json
from pathlib import Path

PATTERN_FILE = Path(__file__).resolve().parents[1] / "data" / "suspicious_patterns.json"


def load_suspicious_patterns() -> list[str]:
    return json.loads(PATTERN_FILE.read_text(encoding="utf-8"))


def detect_scam_signals(text: str) -> list[str]:
    lowered = text.lower()
    hits: list[str] = []
    for token in load_suspicious_patterns():
        if token.lower() in lowered:
            hits.append(token)
    if "@gmail.com" in lowered or "@yahoo.com" in lowered:
        hits.append("free-email-contact")
    if "telegram" in lowered or "signal app" in lowered:
        hits.append("off-platform-chat")
    return sorted(set(hits))

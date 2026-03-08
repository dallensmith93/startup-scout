from __future__ import annotations


def classify_market(tags: list[str], description: str) -> str:
    text = f"{' '.join(tags)} {description}".lower()
    if "developer" in text or "copilot" in text or "code" in text:
        return "Developer Tools"
    if "security" in text or "infra" in text:
        return "Infrastructure"
    if "finance" in text or "fintech" in text:
        return "Fintech"
    if "sales" in text:
        return "Sales Intelligence"
    return "Vertical AI SaaS"

from __future__ import annotations


def build_intro(startup_name: str, role_title: str, matched_keywords: list[str]) -> str:
    keywords = ", ".join(matched_keywords[:3]) if matched_keywords else "product execution and fast learning"
    return (
        f"I am excited to apply for the {role_title} role at {startup_name}. "
        f"My recent work directly maps to your needs in {keywords}, and I thrive in high-ownership teams where product impact is visible quickly."
    )


def build_resume_diff(current_bullets: list[str], suggested_bullets: list[str]) -> list[str]:
    changes: list[str] = []
    if not current_bullets:
        return [f"Add: {bullet}" for bullet in suggested_bullets[:3]]

    for idx, bullet in enumerate(suggested_bullets[: min(3, len(current_bullets))]):
        changes.append(f"Replace bullet {idx + 1}: '{current_bullets[idx]}' -> '{bullet}'")

    if len(suggested_bullets) > len(current_bullets):
        for extra in suggested_bullets[len(current_bullets):3]:
            changes.append(f"Add bullet: '{extra}'")

    return changes


def suggest_bullets(matched: list[str], missing: list[str]) -> list[str]:
    seed = matched[:2] + missing[:2]
    if not seed:
        seed = ["cross-functional execution", "customer communication"]

    return [
        f"Drove {topic} initiatives from discovery to launch, improving delivery speed and user outcomes."
        for topic in seed
    ]

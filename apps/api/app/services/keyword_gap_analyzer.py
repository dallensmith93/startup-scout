from __future__ import annotations

import re

STOPWORDS = {
    "and", "the", "with", "for", "that", "from", "this", "into", "your", "you", "our", "are", "will", "have",
    "using", "build", "ship", "work", "team", "role", "product", "features", "experience"
}


def _tokens(text: str) -> set[str]:
    words = re.findall(r"[a-zA-Z][a-zA-Z\-\.\+]{1,}", text.lower())
    return {w for w in words if len(w) > 2 and w not in STOPWORDS}


def analyze_keyword_gap(resume_text: str, required_skills: list[str]) -> tuple[list[str], list[str], int]:
    resume_tokens = _tokens(resume_text)
    normalized = [skill.strip().lower() for skill in required_skills if skill.strip()]

    matched = sorted({skill for skill in normalized if any(part in resume_tokens for part in skill.split())})
    missing = [skill for skill in normalized if skill not in matched]

    overlap_score = 0
    if normalized:
        overlap_score = round((len(matched) / len(normalized)) * 100)

    return matched, missing, overlap_score

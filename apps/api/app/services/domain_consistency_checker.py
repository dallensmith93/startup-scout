def domain_consistency_score(company_name: str, domain: str) -> int:
    name_token = company_name.lower().replace(" ", "")
    d = domain.lower()

    score = 52
    if name_token[:4] in d:
        score += 26
    if d.endswith((".com", ".io", ".ai", ".org")):
        score += 12
    if "-careers" in d or "jobs." in d:
        score += 6

    return min(score, 100)

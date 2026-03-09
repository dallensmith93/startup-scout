def check_company_surface(company_name: str, website: str, posting_url: str | None = None) -> dict:
    surface_signals: list[str] = []
    red_flags: list[str] = []

    if website.startswith("https://"):
        surface_signals.append("Company website uses HTTPS")
    else:
        red_flags.append("Company website is not using HTTPS")

    if company_name.lower().replace(" ", "") in website.lower().replace("https://", ""):
        surface_signals.append("Company name aligns with website branding")

    if posting_url:
        if website.replace("https://", "").split("/")[0] in posting_url:
            surface_signals.append("Posting URL appears related to company domain")
        else:
            red_flags.append("Posting URL and company website domain look inconsistent")

    if len(surface_signals) == 0:
        surface_signals.append("Basic company metadata captured")

    return {"surfaceSignals": surface_signals, "redFlags": red_flags}

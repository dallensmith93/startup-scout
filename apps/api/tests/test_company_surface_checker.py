from app.services.company_surface_checker import check_company_surface


def test_company_surface_checker_output() -> None:
    data = check_company_surface("Acme", "https://acme.ai", "https://acme.ai/careers/1")
    assert "surfaceSignals" in data
    assert isinstance(data["redFlags"], list)


def test_company_surface_checker_inconsistent_url() -> None:
    data = check_company_surface("Acme", "https://acme.ai", "https://totally-other-site.xyz/job")
    assert len(data["redFlags"]) >= 1

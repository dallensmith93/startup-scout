from app.services.scam_signal_engine import detect_scam_signals


def test_scam_signals_detected() -> None:
    flags = detect_scam_signals("We need gift card and urgent transfer today")
    assert len(flags) >= 1


def test_scam_signal_engine_ignores_clean_text() -> None:
    flags = detect_scam_signals("Interview loop includes manager and technical panel.")
    assert flags == []

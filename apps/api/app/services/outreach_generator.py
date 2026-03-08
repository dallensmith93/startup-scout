from __future__ import annotations

from app.models import OutreachResponse, StartupRecord


TONE_OPENERS = {
    "direct": "I will keep this brief.",
    "warm": "I have been following your progress and wanted to reach out.",
    "technical": "I reviewed your product thesis and engineering direction in detail."
}


def generate_outreach(startup: StartupRecord, candidate_name: str, candidate_pitch: str, tone: str) -> OutreachResponse:
    opener = TONE_OPENERS.get(tone, TONE_OPENERS["warm"])
    subject = f"{candidate_name} x {startup.name}"
    message = (
        f"Hi {startup.name} team,\n\n"
        f"{opener} Your focus on {startup.intelligence.marketCategory.lower()} and AI workflows stands out. "
        f"{candidate_pitch} I would love to contribute to {startup.name}'s next growth sprint.\n\n"
        f"Best,\n{candidate_name}"
    )
    highlights = [
        f"Top fit area: {startup.intelligence.marketCategory}",
        f"Hiring probability is {startup.intelligence.hiringProbability}%",
        "Tailored to startup intelligence profile"
    ]
    return OutreachResponse(subject=subject, message=message, highlights=highlights)

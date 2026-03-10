from __future__ import annotations

from app.models.interview_prep import InterviewPrepResponse
from app.services.keyword_gap_analyzer import analyze_keyword_gap


def generate_interview_prep(
    application_id: str,
    startup_name: str,
    role_title: str,
    resume_text: str,
    required_skills: list[str],
    focus_areas: list[str] | None = None,
) -> InterviewPrepResponse:
    matched, missing, overlap = analyze_keyword_gap(resume_text, required_skills)

    talking_points = [
        f"Why {startup_name}: connect your background to their immediate execution goals.",
        f"Role fit: show concrete proof for {matched[0] if matched else 'high-ownership delivery'}.",
        "Execution style: explain how you de-risk ambiguous projects quickly.",
    ]

    likely_questions = [
        "Tell us about a project where you moved from ambiguity to shipped outcome.",
        f"How have you applied {required_skills[0] if required_skills else 'core technical skills'} under deadlines?",
        "What tradeoffs do you make when quality and speed are in tension?",
    ]
    for area in (focus_areas or [])[:2]:
        likely_questions.append(f"How do you approach {area} when delivery timelines are tight?")
    if missing:
        likely_questions.append(f"How would you ramp on {missing[0]} in your first 30 days?")

    questions_for_employer = [
        "What outcomes define success in the first 60 days?",
        "Which current product bottleneck is most urgent for this role?",
        "How does the team evaluate quality for AI-assisted features before release?",
    ]

    checklist = [
        "Prepare two STAR stories with quantified outcomes.",
        "Bring one architecture decision example with tradeoffs.",
        "Draft a concise 30-60-90 day impact outline.",
    ]

    return InterviewPrepResponse(
        applicationId=application_id,
        talkingPoints=talking_points,
        likelyQuestions=likely_questions,
        questionsToAskEmployer=questions_for_employer,
        prepChecklist=checklist,
        reasoning=[
            f"Keyword overlap for role prep is {overlap}%.",
            f"Interview focus emphasizes {'matched strengths' if matched else 'clear execution evidence'} and role-risk mitigation.",
        ],
    )

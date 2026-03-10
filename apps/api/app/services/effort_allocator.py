from __future__ import annotations

from app.models.planner import EffortAllocationItem


def allocate_effort(state: dict, bottlenecks: list[str]) -> list[EffortAllocationItem]:
    has_conversion_issue = any("response rate" in b.lower() or "conversion" in b.lower() for b in bottlenecks)
    has_followup_issue = any("follow-up" in b.lower() for b in bottlenecks)
    has_decay_issue = any("decay" in b.lower() for b in bottlenecks)

    outreach_hours = 9 if has_conversion_issue else 7
    followup_hours = 9 if has_followup_issue or has_decay_issue else 6
    tailoring_hours = 6 if has_conversion_issue else 7
    interview_hours = 4

    return [
        EffortAllocationItem(category="Outreach", hours=outreach_hours, reason="Top-of-funnel consistency drives opportunity volume."),
        EffortAllocationItem(category="Follow-ups", hours=followup_hours, reason="Fast follow-ups prevent pipeline decay and preserve momentum."),
        EffortAllocationItem(category="Tailoring", hours=tailoring_hours, reason="Targeted tailoring raises response quality."),
        EffortAllocationItem(category="Interview Prep", hours=interview_hours, reason="Prepared interviews increase close probability."),
    ]

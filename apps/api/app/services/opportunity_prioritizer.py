from __future__ import annotations

from app.models.priorities import PrioritiesResponse, PriorityItem
from app.services.momentum_analyzer import compute_opportunity_decay


def prioritize_opportunities(state: dict) -> PrioritiesResponse:
    decay_by_id = {item["applicationId"]: item for item in compute_opportunity_decay(state)}

    queue = sorted(state["applications"], key=lambda x: (x["priorityScore"], x["fitScore"]), reverse=True)

    items = []
    for app in queue:
        decay = decay_by_id[app["id"]]
        effective_score = min(
            100,
            round(
                app["priorityScore"] * 0.65
                + app["fitScore"] * 0.2
                + decay["decayScore"] * 0.2
                + max(0, 50 - app["riskScore"]) * 0.1
            ),
        )
        items.append(
            PriorityItem(
                applicationId=app["id"],
                startupName=app["startupName"],
                roleTitle=app["roleTitle"],
                priorityScore=app["priorityScore"],
                fitScore=app["fitScore"],
                riskScore=app["riskScore"],
                decayScore=decay["decayScore"],
                effectivePriorityScore=effective_score,
                urgencyWindow=decay.get("timeWindow", "72h"),
                whyNowSignals=[
                    f"Effective priority score is {effective_score}.",
                    f"Decay score {decay['decayScore']} indicates urgency {decay['urgency']}.",
                    f"Due date pressure is {decay['daysToDue']} days.",
                ],
                nextBestAction=decay.get("nextAction", "Send a concise follow-up today."),
                whyNow=(
                    f"Prioritize now: fit {app['fitScore']}, risk {app['riskScore']}, decay {decay['decayScore']}, "
                    f"last touch {decay['daysSinceLastTouch']} days ago, due date in {decay['daysToDue']} days."
                ),
            )
        )

    return PrioritiesResponse(queue=items, reason="Priority queue ranks fit, risk, and decay-aware urgency into one deterministic score.")

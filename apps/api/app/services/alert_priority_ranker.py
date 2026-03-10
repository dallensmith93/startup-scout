from __future__ import annotations


def rank_with_importance(items: list[dict]) -> list[dict]:
    ranked = sorted(
        items,
        key=lambda item: (
            int(item["importanceScore"]),
            -int(item.get("daysUntilDue", 0)),
            item.get("dueDate", ""),
        ),
        reverse=True,
    )
    for idx, item in enumerate(ranked, start=1):
        item["importanceRank"] = idx
    return ranked

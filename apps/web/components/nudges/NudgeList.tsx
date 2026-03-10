import Link from "next/link";
import type { NudgeItem } from "../../lib/nudge-api";

function priorityClass(priority: NudgeItem["priority"]): string {
  if (priority === "high") return "nudges-priority-high";
  if (priority === "medium") return "nudges-priority-medium";
  return "nudges-priority-low";
}

export function NudgeList({ items }: { items: NudgeItem[] }) {
  if (items.length === 0) {
    return (
      <section className="card">
        <h3>Nudge Queue</h3>
        <p className="empty nudges-empty">No nudges match these filters. Reset filters to show the full queue.</p>
      </section>
    );
  }

  return (
    <section className="nudges-list">
      {items.map((item) => (
        <article key={item.id} className="card nudges-card">
          <div className="nudges-card-head">
            <h3>{item.title}</h3>
            <span className={`status-pill ${priorityClass(item.priority)}`}>{item.priority}</span>
          </div>
          <div className="chip-row">
            <span className="chip">{item.kind}</span>
            <span className="chip">{item.state}</span>
            <span className="chip">{item.window}</span>
          </div>
          <p className="brief-inline-head">Impact</p>
          <p>{item.impact}</p>
          <p className="brief-inline-head">Reason</p>
          <p>{item.reason}</p>
          <div className="row-end">
            <span className="muted">{item.window}</span>
            <Link href={item.actionPath} className="link-btn">
              {item.actionLabel}
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}

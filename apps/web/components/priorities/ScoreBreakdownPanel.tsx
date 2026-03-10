import type { PriorityItem as PriorityItemType } from "../../lib/priority-api";

export function ScoreBreakdownPanel({ items }: { items: PriorityItemType[] }) {
  return (
    <section className="card">
      <h3>Score Breakdown</h3>
      <ul className="list-clean">
        {items.slice(0, 5).map((item) => (
          <li key={item.applicationId}>
            <div className="row-end">
              <strong>{item.startupName}</strong>
              <span className="status-pill tailoring">{item.priorityScore}</span>
            </div>
            <p className="muted" style={{ margin: "4px 0 0" }}>
              Fit {item.fitScore} | Risk {item.riskScore} | Decay {item.decayScore} | Window {item.urgencyWindow}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

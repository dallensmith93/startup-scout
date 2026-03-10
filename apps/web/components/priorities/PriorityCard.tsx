import type { PriorityItem as PriorityItemType } from "../../lib/priority-api";

function decayClass(decayScore: number): string {
  if (decayScore >= 70) return "rejected";
  if (decayScore >= 50) return "saved";
  return "interview";
}

export function PriorityCard({ item }: { item: PriorityItemType }) {
  return (
    <article className="card">
      <div className="row-end" style={{ alignItems: "flex-start" }}>
        <h3 style={{ margin: 0 }}>{item.startupName}</h3>
        <span className="status-pill tailoring">Priority {item.priorityScore}</span>
      </div>
      <p className="muted" style={{ marginBottom: 10 }}>{item.roleTitle}</p>
      <p style={{ marginTop: 0 }}>{item.whyNow}</p>
      <div className="chip-row" style={{ marginTop: 10 }}>
        <span className={`status-pill ${decayClass(item.decayScore)}`}>Decay {item.decayScore}</span>
        <span className="chip">Window: {item.urgencyWindow}</span>
        <span className="chip">Fit {item.fitScore}</span>
        <span className="chip">Risk {item.riskScore}</span>
      </div>
      <p className="dashboard-mini-head" style={{ marginTop: 12 }}>Why now signals</p>
      <ul className="list-clean" style={{ marginTop: 6 }}>
        {item.whyNowSignals.slice(0, 3).map((signal) => <li key={signal}>{signal}</li>)}
      </ul>
      <p className="muted" style={{ marginBottom: 0 }}><strong>Next:</strong> {item.nextBestAction}</p>
    </article>
  );
}

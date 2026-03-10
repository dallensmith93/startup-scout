import type { OpportunityDecay } from "../../lib/dashboard-api";

function decayToneClass(score: number): string {
  if (score >= 75) return "rejected";
  if (score >= 55) return "saved";
  return "interview";
}

export function OpportunityDecayPanel({ items }: { items: OpportunityDecay[] }) {
  return (
    <section className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>Opportunity Decay</h3>
        <span className="muted">Act before value drops</span>
      </div>
      {items.length === 0 && <p className="empty">No significant decay risk in the current queue.</p>}
      <div className="dashboard-stack" style={{ marginTop: 10 }}>
        {items.slice(0, 3).map((item) => (
          <article key={item.applicationId} className="dashboard-list-row">
            <div className="row-end" style={{ alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: 0 }}><strong>{item.startupName}</strong> - {item.roleTitle}</p>
                <p className="muted" style={{ margin: "4px 0 0" }}>{item.reason}</p>
              </div>
              <span className={`status-pill ${decayToneClass(item.decayScore)}`}>{item.decayScore} decay</span>
            </div>
            <div className="row-end" style={{ marginTop: 8 }}>
              <span className="chip">Window: {item.timeWindow}</span>
              <span className="muted">{item.nextAction}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

import type { PriorityItem as PriorityItemType } from "../../lib/priority-api";

export function WhyNowCard({ item }: { item?: PriorityItemType }) {
  if (!item) return <section className="card"><h3>Why Now</h3><p className="empty">No priority item selected.</p></section>;
  return (
    <section className="card accent-card">
      <div className="row-end" style={{ alignItems: "flex-start" }}>
        <h3 style={{ margin: 0 }}>Why Now</h3>
        <span className="status-pill saved">{item.urgencyWindow}</span>
      </div>
      <p style={{ marginBottom: 4 }}><strong>{item.startupName}</strong> - {item.roleTitle}</p>
      <p className="muted" style={{ marginTop: 0 }}>{item.whyNow}</p>
      <p className="dashboard-mini-head" style={{ marginTop: 12 }}>Decision clarity</p>
      <ul className="list-clean" style={{ marginTop: 6 }}>
        {item.whyNowSignals.slice(0, 3).map((signal) => <li key={signal}>{signal}</li>)}
      </ul>
      <p style={{ marginBottom: 0 }}><strong>Act now:</strong> {item.nextBestAction}</p>
    </section>
  );
}

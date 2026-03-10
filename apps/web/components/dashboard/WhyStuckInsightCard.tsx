import type { StuckInsight } from "../../lib/dashboard-api";

export function WhyStuckInsightCard({ insight }: { insight: StuckInsight }) {
  return (
    <section className="card">
      <h3 style={{ marginTop: 0 }}>Why You're Stuck</h3>
      <p style={{ margin: "0 0 6px" }}><strong>{insight.headline}</strong></p>
      <p className="muted" style={{ marginTop: 0 }}>{insight.cause}</p>
      <p className="dashboard-mini-head">Evidence</p>
      <ul className="list-clean" style={{ marginTop: 6 }}>
        {insight.evidence.map((line) => <li key={line}>{line}</li>)}
      </ul>
      <p className="dashboard-mini-head" style={{ marginTop: 12 }}>Unblock Next</p>
      <ul className="list-clean" style={{ marginTop: 6 }}>
        {insight.unblockActions.map((line) => <li key={line}>{line}</li>)}
      </ul>
    </section>
  );
}

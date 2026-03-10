import type { DashboardData } from "../../lib/dashboard-api";

export function DashboardHero({ data }: { data: DashboardData }) {
  return (
    <section className="card accent-card">
      <div className="row-end">
        <div>
          <h3 style={{ margin: 0 }}>Command Center</h3>
          <p className="muted" style={{ margin: "6px 0 0" }}>Run your search like an operating system, not a checklist.</p>
        </div>
        <div>
          <span className="muted">Momentum</span>
          <p className="hero-score" style={{ marginTop: 2 }}>{data.momentumScore}</p>
        </div>
      </div>
      <p style={{ marginBottom: 0 }}>{data.reason}</p>
    </section>
  );
}

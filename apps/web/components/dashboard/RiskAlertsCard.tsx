import type { RiskAlert } from "../../lib/dashboard-api";

export function RiskAlertsCard({ alerts }: { alerts: RiskAlert[] }) {
  return (
    <section className="card">
      <h3>Risk Alerts</h3>
      {alerts.length === 0 && <p className="empty">No active risk alerts.</p>}
      <ul className="list-clean">
        {alerts.map((alert) => (
          <li key={alert.applicationId}>
            <span className={`status-pill ${alert.severity === "high" ? "rejected" : "tailoring"}`}>{alert.severity}</span>
            <span style={{ marginLeft: 8 }}>{alert.headline}</span>
            <p className="muted" style={{ margin: "4px 0 0" }}>{alert.reason}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

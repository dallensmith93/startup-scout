import type { AnalyticsData } from "../../lib/analytics-api";

export function FunnelBreakdown({ data }: { data: AnalyticsData }) {
  const entries = Object.entries(data.funnel);
  return (
    <section className="card">
      <h3>Funnel Breakdown</h3>
      <ul className="list-clean">
        {entries.map(([stage, count]) => (
          <li key={stage}>
            <strong style={{ textTransform: "capitalize" }}>{stage}</strong>: {count}
          </li>
        ))}
      </ul>
    </section>
  );
}

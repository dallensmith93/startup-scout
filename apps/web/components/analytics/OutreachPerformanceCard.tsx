import type { AnalyticsData } from "../../lib/analytics-api";

export function OutreachPerformanceCard({ data }: { data: AnalyticsData }) {
  const responseShare = data.outreachSent > 0 ? Math.round((data.outreachResponses / data.outreachSent) * 100) : 0;

  return (
    <section className="card">
      <h3>Outreach Snapshot</h3>
      <p>Sent: <strong>{data.outreachSent}</strong></p>
      <p>Responses: <strong>{data.outreachResponses}</strong></p>
      <p>Reply share: <strong>{responseShare}%</strong></p>
      <p className="muted">{data.reason}</p>
    </section>
  );
}

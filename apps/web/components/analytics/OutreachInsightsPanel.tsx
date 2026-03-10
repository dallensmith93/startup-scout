import type { AnalyticsData } from "../../lib/analytics-api";

function getOutreachRate(sent: number, responses: number): number {
  if (sent <= 0) return 0;
  return Math.round((responses / sent) * 100);
}

export function OutreachInsightsPanel({ data }: { data: AnalyticsData }) {
  const outreachRate = getOutreachRate(data.outreachSent, data.outreachResponses);
  const targetRate = data.outreachTargetResponseRate ?? 25;
  const gap = targetRate - outreachRate;

  const qualityLabel =
    outreachRate >= targetRate ? "At or above target" : outreachRate >= 16 ? "Near target" : "Needs intervention";

  const recommendations = [
    gap > 0
      ? `Raise reply rate by about ${gap} points with tighter personalization on your next 10 messages.`
      : "Keep current message quality and increase volume by 15 to 20 percent.",
    data.outreachSent < 15
      ? "Send one focused outreach block today to stabilize weekly top-of-funnel input."
      : "Protect daily outreach cadence to avoid funnel volatility.",
    data.momentumScore < 70
      ? "Prioritize warm follow-ups before new cold outreach to lift momentum quickly."
      : "Double down on channels producing the highest response quality."
  ];
  const backendInsights = data.outreachPerformanceInsights ?? [];

  return (
    <section className="card outreach-insights">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>Outreach Performance Insights</h3>
        <span className={`status-pill ${outreachRate >= targetRate ? "offer" : outreachRate >= 16 ? "tailoring" : "rejected"}`}>
          {qualityLabel}
        </span>
      </div>

      <div className="insight-metrics" style={{ marginTop: 12 }}>
        <article>
          <p className="muted">Outreach Sent</p>
          <strong>{data.outreachSent}</strong>
        </article>
        <article>
          <p className="muted">Responses</p>
          <strong>{data.outreachResponses}</strong>
        </article>
        <article>
          <p className="muted">Outreach Response Rate</p>
          <strong>{outreachRate}%</strong>
        </article>
        <article>
          <p className="muted">Target</p>
          <strong>{targetRate}%</strong>
        </article>
      </div>

      <div className="meter" style={{ marginTop: 12 }}>
        <span style={{ width: `${Math.min(100, Math.round((outreachRate / targetRate) * 100))}%` }} />
      </div>

      <ul className="list-clean" style={{ marginTop: 12 }}>
        {recommendations.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
      {backendInsights.length > 0 && (
        <>
          <p className="dashboard-mini-head" style={{ marginTop: 12 }}>Detected Insights</p>
          <ul className="list-clean" style={{ marginTop: 6 }}>
            {backendInsights.slice(0, 3).map((insight) => (
              <li key={insight.title}>
                <strong>{insight.title} ({insight.value})</strong>: {insight.reason}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

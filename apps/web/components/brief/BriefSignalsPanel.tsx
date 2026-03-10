import type { BriefSignal } from "../../lib/brief-api";

function trendGlyph(trend: BriefSignal["trend"]): string {
  if (trend === "up") return "up";
  if (trend === "down") return "down";
  return "flat";
}

export function BriefSignalsPanel({ signals, risks }: { signals: BriefSignal[]; risks: string[] }) {
  return (
    <section className="card">
      <div className="brief-section-head">
        <h3>Signals and Risks</h3>
      </div>
      <div className="brief-signal-grid">
        {signals.map((signal) => (
          <article key={signal.id} className="brief-signal">
            <p className="brief-signal-label">{signal.label}</p>
            <p className="brief-signal-value">{signal.value}</p>
            <p className={`brief-signal-trend brief-signal-trend-${signal.trend}`}>{trendGlyph(signal.trend)}</p>
            <p>{signal.reason}</p>
          </article>
        ))}
      </div>
      <div className="brief-risk-panel">
        <h4>Watchouts</h4>
        {risks.length === 0 ? (
          <p className="muted">No major blockers detected right now.</p>
        ) : (
          <ul className="list-clean">
            {risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

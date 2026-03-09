import type { LegitimacyResult } from "../../lib/legitimacy-types";

export default function RiskBreakdown({ result }: { result: LegitimacyResult }) {
  return (
    <article className="card">
      <h3>Score Breakdown</h3>
      <ul>
        {Object.entries(result.evidence.scoreBreakdown).map(([k, v]) => (
          <li key={k}>{k}: {v}</li>
        ))}
      </ul>
    </article>
  );
}

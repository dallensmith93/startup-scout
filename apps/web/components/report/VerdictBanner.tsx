import type { LegitimacyResult } from "../../lib/legitimacy-types";

export default function VerdictBanner({ result }: { result: LegitimacyResult }) {
  return (
    <article className={`card verdict ${result.riskLevel}`}>
      <h3>Verdict</h3>
      <p>{result.explanationSummary}</p>
      <p className="muted">Recommended next step: {result.recommendedAction}</p>
    </article>
  );
}

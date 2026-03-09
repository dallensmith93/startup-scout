import type { LegitimacyResult } from "../../lib/legitimacy-types";

export default function LegitimacyScoreCard({ result }: { result: LegitimacyResult }) {
  return (
    <article className="card">
      <h3>Legitimacy Score</h3>
      <p className="hero-score">{result.legitimacyScore}</p>
      <p className="muted">Scam risk: {result.scamRiskScore} | Confidence: {Math.round(result.confidence * 100)}%</p>
    </article>
  );
}

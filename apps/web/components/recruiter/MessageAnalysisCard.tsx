import type { RecruiterCheckResult } from "../../lib/legitimacy-types";

export default function MessageAnalysisCard({ result }: { result: RecruiterCheckResult | null }) {
  if (!result) return <article className="card"><p className="muted">Run analysis to view message risk profile.</p></article>;
  return (
    <article className="card">
      <h3>Recruiter Message Analysis</h3>
      <p>Authenticity score: <strong>{result.authenticityScore}</strong></p>
      <p>Risk level: <strong>{result.riskLevel}</strong></p>
      <p className="muted">{result.explanationSummary}</p>
    </article>
  );
}

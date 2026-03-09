import type { CompanyCheckResult } from "../../lib/legitimacy-types";

export default function DomainTrustCard({ result }: { result: CompanyCheckResult | null }) {
  if (!result) return <article className="card"><p className="muted">No company report yet.</p></article>;
  return (
    <article className="card">
      <h3>Domain Trust</h3>
      <p className="hero-score">{result.domainTrust}</p>
      <p className="muted">Consistency score: {result.consistencyScore}</p>
      <p>Risk: <strong>{result.riskLevel}</strong></p>
    </article>
  );
}

import type { LegitimacyResult } from "../../lib/legitimacy-types";

export default function EvidenceSection({ result }: { result: LegitimacyResult }) {
  return (
    <article className="card">
      <h3>Evidence</h3>
      <p><strong>Positive evidence</strong></p>
      <ul>{result.evidence.positiveEvidence.map((x) => <li key={x}>{x}</li>)}</ul>
      <p><strong>Risk evidence</strong></p>
      <ul>{result.evidence.riskEvidence.map((x) => <li key={x}>{x}</li>)}</ul>
    </article>
  );
}

import type { CompanyCheckResult } from "../../lib/legitimacy-types";

export default function CompanySurfacePanel({ result }: { result: CompanyCheckResult | null }) {
  if (!result) return <article className="card"><p className="muted">Analyze a company to inspect trust surface.</p></article>;
  return (
    <article className="card">
      <h3>Company Surface Signals</h3>
      <ul>{result.surfaceSignals.map((s) => <li key={s}>{s}</li>)}</ul>
      {result.redFlags.length > 0 && <ul>{result.redFlags.map((f) => <li key={f}>{f}</li>)}</ul>}
    </article>
  );
}

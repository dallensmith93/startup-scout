import type { LegitimacyResult } from "../../lib/legitimacy-types";

export default function ReportHeader({ result }: { result: LegitimacyResult }) {
  return (
    <header className="page-head">
      <h2>Legitimacy Report #{result.reportId}</h2>
      <p className="muted">Risk level: {result.riskLevel}</p>
    </header>
  );
}

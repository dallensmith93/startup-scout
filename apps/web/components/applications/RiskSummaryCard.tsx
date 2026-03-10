import type { FitCategory } from "../../lib/application-types";

export default function RiskSummaryCard({ risk }: { risk: FitCategory }) {
  return (
    <article className="card">
      <h3>Risk Summary</h3>
      <p className="hero-score">{risk.score}</p>
      <p className="muted">{risk.label} risk level</p>
      <ul className="list-clean">
        {risk.reasoning.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </article>
  );
}

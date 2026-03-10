import type { FitCategory } from "../../lib/application-types";

export default function FitSummaryCard({ fit }: { fit: FitCategory }) {
  return (
    <article className="card">
      <h3>Fit Summary</h3>
      <p className="hero-score">{fit.score}</p>
      <p className="muted">{fit.label} alignment</p>
      <ul className="list-clean">
        {fit.reasoning.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </article>
  );
}

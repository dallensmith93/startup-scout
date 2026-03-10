import type { WarmPath } from "../../lib/network-api";

type WarmPathScorePanelProps = {
  items: WarmPath[];
};

export function WarmPathScorePanel({ items }: WarmPathScorePanelProps) {
  const sorted = [...items].sort((a, b) => b.introLikelihood - a.introLikelihood);

  return (
    <section className="card">
      <h3 style={{ marginTop: 0 }}>Warm Path Scores</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {sorted.map((item) => (
          <div key={item.id} style={{ border: "1px solid #2a4168", borderRadius: 10, padding: 10 }}>
            <div className="row-end">
              <strong>{item.targetCompany}</strong>
              <span className="chip">{item.introLikelihood}%</span>
            </div>
            <p className="muted" style={{ margin: "6px 0 0" }}>{item.targetRole}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

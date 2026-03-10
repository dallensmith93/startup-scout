import type { PipelineItem } from "../../lib/dashboard-api";

export function PipelineSnapshot({ items }: { items: PipelineItem[] }) {
  return (
    <section className="card">
      <h3>Pipeline Snapshot</h3>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))" }}>
        {items.map((item) => (
          <article key={item.stage} className="table-card" style={{ padding: 12 }}>
            <p className="muted" style={{ margin: 0, textTransform: "capitalize" }}>{item.stage}</p>
            <p className="hero-score" style={{ margin: "4px 0 0", fontSize: 28 }}>{item.count}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

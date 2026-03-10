import type { CoolingRelationship } from "../../lib/relationship-api";

type CoolingOffPanelProps = {
  items: CoolingRelationship[];
};

export function CoolingOffPanel({ items }: CoolingOffPanelProps) {
  return (
    <section className="card">
      <h3 style={{ marginTop: 0 }}>Cooling Off</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {items.map((item) => (
          <article key={item.id} style={{ border: "1px solid #2a4168", borderRadius: 10, padding: 10 }}>
            <div className="row-end">
              <strong>{item.contactName}</strong>
              <span className={item.riskLevel === "high" ? "score-badge low" : "score-badge mid"}>
                {item.riskLevel}
              </span>
            </div>
            <p className="muted" style={{ marginTop: 6 }}>{item.company} | {item.daysSinceTouch} days since touch</p>
            <p style={{ margin: "8px 0 0" }}>{item.nextMessage}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

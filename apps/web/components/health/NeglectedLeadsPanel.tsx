import type { NeglectedLead } from "../../lib/relationship-api";

type NeglectedLeadsPanelProps = {
  items: NeglectedLead[];
};

export function NeglectedLeadsPanel({ items }: NeglectedLeadsPanelProps) {
  return (
    <section className="card">
      <h3 style={{ marginTop: 0 }}>Neglected Leads</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {items.map((item) => (
          <article key={item.id} style={{ border: "1px solid #2a4168", borderRadius: 10, padding: 10 }}>
            <div className="row-end">
              <strong>{item.contactName}</strong>
              <span className="chip">{item.company}</span>
            </div>
            <p className="muted" style={{ marginTop: 6 }}>Missed moments: {item.missedMoments}</p>
            <p style={{ margin: "8px 0 0" }}>{item.suggestedAction}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

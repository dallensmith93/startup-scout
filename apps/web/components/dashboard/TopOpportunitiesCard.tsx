import type { Opportunity } from "../../lib/dashboard-api";

export function TopOpportunitiesCard({ items }: { items: Opportunity[] }) {
  return (
    <section className="card">
      <h3>Top Opportunities</h3>
      <ul className="list-clean">
        {items.map((item) => (
          <li key={item.applicationId}>
            <strong>{item.startupName}</strong> - {item.roleTitle} ({item.score})
            <p className="muted" style={{ margin: "4px 0 0" }}>{item.reason}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

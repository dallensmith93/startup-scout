import type { EffortAllocationItem } from "../../lib/planner-api";

export function EffortAllocator({ items }: { items: EffortAllocationItem[] }) {
  return (
    <section className="card">
      <h3>Effort Allocation</h3>
      <ul className="list-clean">
        {items.map((item) => (
          <li key={item.category}>
            <strong>{item.category}:</strong> {item.hours}h
            <p className="muted" style={{ margin: "4px 0 0" }}>{item.reason}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

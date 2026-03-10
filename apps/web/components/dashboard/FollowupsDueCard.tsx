import type { FollowupItem } from "../../lib/task-api";

export function FollowupsDueCard({ items }: { items: FollowupItem[] }) {
  return (
    <section className="card">
      <h3>Follow-ups Due</h3>
      {items.length === 0 && <p className="empty">No urgent follow-ups in this window.</p>}
      <ul className="list-clean">
        {items.slice(0, 4).map((item) => (
          <li key={item.applicationId}>{item.startupName} ({item.dueDate}) - {item.reason}</li>
        ))}
      </ul>
    </section>
  );
}

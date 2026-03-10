import type { FollowupItem } from "../../lib/task-api";

export function DueSoonPanel({ items }: { items: FollowupItem[] }) {
  return (
    <section className="card">
      <h3>Due Soon</h3>
      <ul className="list-clean">
        {items.map((item) => (
          <li key={item.applicationId}>
            <strong>{item.startupName}</strong> ({item.roleTitle})
            <div className="muted">Due {item.dueDate} - {item.reason}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

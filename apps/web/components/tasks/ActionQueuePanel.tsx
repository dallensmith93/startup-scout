import type { TaskItem } from "../../lib/task-api";

function getDaysUntil(dueDate: string): number {
  const now = new Date();
  const due = new Date(`${dueDate}T23:59:59`);
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function ActionQueuePanel({ items }: { items: TaskItem[] }) {
  const sorted = [...items].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const urgent = sorted.filter((item) => item.priority === "high" || getDaysUntil(item.dueDate) <= 1).length;
  const next = sorted.filter((item) => getDaysUntil(item.dueDate) > 1 && getDaysUntil(item.dueDate) <= 4).length;
  const later = Math.max(0, sorted.length - urgent - next);

  return (
    <section className="card action-queue-panel">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>Action Queue</h3>
        <span className="muted">{sorted.length} tasks</span>
      </div>

      <div className="insight-metrics" style={{ marginTop: 12 }}>
        <article>
          <p className="muted">Urgent</p>
          <strong>{urgent}</strong>
        </article>
        <article>
          <p className="muted">Next Up</p>
          <strong>{next}</strong>
        </article>
        <article>
          <p className="muted">Later</p>
          <strong>{later}</strong>
        </article>
      </div>

      <ol className="queue-list">
        {sorted.slice(0, 5).map((item) => {
          const daysUntil = getDaysUntil(item.dueDate);
          const dueLabel = daysUntil < 0 ? "Overdue" : daysUntil === 0 ? "Due today" : `${daysUntil}d`;
          return (
            <li key={item.id}>
              <span>{item.title}</span>
              <span className={`status-pill ${daysUntil <= 1 ? "rejected" : daysUntil <= 4 ? "tailoring" : "saved"}`}>
                {dueLabel}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

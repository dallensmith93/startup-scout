import type { TaskItem } from "../../lib/task-api";

function getDaysUntil(dueDate: string): number {
  const now = new Date();
  const due = new Date(`${dueDate}T23:59:59`);
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function TaskCard({ item }: { item: TaskItem }) {
  const daysUntil = getDaysUntil(item.dueDate);
  const dueLabel = daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : daysUntil === 0 ? "due today" : `due in ${daysUntil}d`;
  const dueClass = daysUntil <= 1 ? "rejected" : daysUntil <= 4 ? "tailoring" : "saved";

  return (
    <article className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>{item.title}</h3>
        <span className={`status-pill ${item.priority === "high" ? "rejected" : item.priority === "medium" ? "tailoring" : "saved"}`}>
          {item.priority}
        </span>
      </div>

      <div className="chip-row" style={{ marginTop: 10 }}>
        <span className="chip">{item.category}</span>
        <span className={`status-pill ${dueClass}`}>{dueLabel}</span>
      </div>

      <p style={{ marginBottom: 0 }}>{item.reason}</p>
    </article>
  );
}

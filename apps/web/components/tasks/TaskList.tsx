import type { TaskItem } from "../../lib/task-api";
import { TaskCard } from "./TaskCard";

export function TaskList({ items }: { items: TaskItem[] }) {
  if (!items.length) return <p className="empty">No tasks generated.</p>;

  const sorted = [...items].sort((a, b) => {
    const priorityRank: Record<string, number> = { high: 0, medium: 1, low: 2 };
    const rankDiff = (priorityRank[a.priority] ?? 3) - (priorityRank[b.priority] ?? 3);
    if (rankDiff !== 0) return rankDiff;
    return a.dueDate.localeCompare(b.dueDate);
  });

  return (
    <section>
      <div className="row-end" style={{ marginBottom: 10 }}>
        <h3 style={{ margin: 0 }}>Execution Queue</h3>
        <span className="muted">{sorted.length} items</span>
      </div>
      <div className="grid">{sorted.map((item) => <TaskCard key={item.id} item={item} />)}</div>
    </section>
  );
}

import type { ReminderItem } from "../../lib/reminders-api";

type ReminderListProps = {
  items: ReminderItem[];
  onToggleDone: (id: string) => void;
  onDelete: (id: string) => void;
  onSnooze: (id: string) => void;
};

function formatDay(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function priorityClass(priority: ReminderItem["priority"]) {
  if (priority === "high") return "score-badge low";
  if (priority === "medium") return "score-badge mid";
  return "score-badge high";
}

export function ReminderList({ items, onToggleDone, onDelete, onSnooze }: ReminderListProps) {
  if (!items.length) {
    return <p className="empty">No reminders in this view.</p>;
  }

  return (
    <section className="reminders-stack">
      {items.map((item) => (
        <article key={item.id} className={item.status === "done" ? "card reminders-item done" : "card reminders-item"}>
          <div className="card-top">
            <div>
              <h3>{item.title}</h3>
              <p className="muted" style={{ margin: "6px 0 0" }}>
                Due {formatDay(item.dueDate)}
              </p>
            </div>
            <span className={priorityClass(item.priority)}>{item.priority}</span>
          </div>
          {item.context ? <p className="desc reminders-context">{item.context}</p> : null}
          <div className="reminders-actions">
            <button className="reminders-btn" type="button" onClick={() => onToggleDone(item.id)}>
              {item.status === "done" ? "Mark active" : "Mark done"}
            </button>
            {item.status !== "done" ? (
              <button className="reminders-btn" type="button" onClick={() => onSnooze(item.id)}>
                Snooze +1 day
              </button>
            ) : null}
            <button className="reminders-btn danger" type="button" onClick={() => onDelete(item.id)}>
              Remove
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}

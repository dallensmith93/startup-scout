import type { DashboardActionItem } from "../../lib/dashboard-api";

function actionTypeLabel(actionType: DashboardActionItem["actionType"]): string {
  if (actionType === "follow_up") return "Follow-up";
  if (actionType === "tailor") return "Tailor";
  if (actionType === "prep") return "Prep";
  return "Apply";
}

function priorityClass(priority: DashboardActionItem["priority"]): string {
  if (priority === "high") return "rejected";
  if (priority === "medium") return "saved";
  return "interview";
}

export function ActionQueuePreviewCard({ items }: { items: DashboardActionItem[] }) {
  return (
    <section className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>Action Queue Preview</h3>
        <span className="muted">Next execution block</span>
      </div>
      {items.length === 0 && <p className="empty">No queued actions right now.</p>}
      <div className="dashboard-stack" style={{ marginTop: 10 }}>
        {items.slice(0, 4).map((item) => (
          <article key={item.id} className="dashboard-list-row">
            <div className="row-end" style={{ alignItems: "flex-start" }}>
              <p style={{ margin: 0 }}><strong>{item.title}</strong></p>
              <span className={`status-pill ${priorityClass(item.priority)}`}>{item.priority}</span>
            </div>
            <p className="muted" style={{ margin: "6px 0" }}>{item.reason}</p>
            <div className="row-end">
              <span className="chip">{actionTypeLabel(item.actionType)}</span>
              <span className="chip">{item.etaMinutes} min</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

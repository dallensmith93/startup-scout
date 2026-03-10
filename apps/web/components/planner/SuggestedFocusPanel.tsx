import type { PlannedAction } from "../../lib/planner-api";

export function SuggestedFocusPanel({ actions }: { actions: PlannedAction[] }) {
  return (
    <section className="card">
      <h3>Suggested Focus</h3>
      <ul className="list-clean">
        {actions.map((action) => (
          <li key={`${action.day}-${action.title}`}>
            <strong>{action.day}:</strong> {action.title}
            <p className="muted" style={{ margin: "4px 0 0" }}>{action.reason}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

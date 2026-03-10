import type { WeeklyPlanData } from "../../lib/planner-api";

export function WeeklyPlanCard({ plan }: { plan: WeeklyPlanData }) {
  return (
    <section className="card">
      <h3>Weekly Theme</h3>
      <p><strong>{plan.focusTheme}</strong></p>
      <p className="muted">Week of {plan.weekOf}</p>
      <p>{plan.summary}</p>
    </section>
  );
}

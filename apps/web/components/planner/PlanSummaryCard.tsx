import type { WeeklyPlanData } from "../../lib/planner-api";

export function PlanSummaryCard({ plan }: { plan: WeeklyPlanData }) {
  return (
    <section className="card">
      <h3>Plan Summary</h3>
      <p>{plan.summary}</p>
      <p className="muted">Execution principle: consistency beats bursts.</p>
    </section>
  );
}

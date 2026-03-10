"use client";

import { useEffect, useState } from "react";
import { EffortAllocator } from "../../components/planner/EffortAllocator";
import { PlanSummaryCard } from "../../components/planner/PlanSummaryCard";
import { SuggestedFocusPanel } from "../../components/planner/SuggestedFocusPanel";
import { WeeklyPlanCard } from "../../components/planner/WeeklyPlanCard";
import { getPlannerData, type WeeklyPlanData } from "../../lib/planner-api";

export default function PlannerPage() {
  const [plan, setPlan] = useState<WeeklyPlanData | null>(null);
  useEffect(() => { void getPlannerData().then(setPlan); }, []);
  if (!plan) return <main><p className="empty">Loading weekly plan...</p></main>;

  return (
    <main>
      <header className="page-head"><h2>Weekly Planner</h2><p className="muted">Turn strategy into scheduled execution.</p></header>
      <div className="detail-grid">
        <WeeklyPlanCard plan={plan} />
        <PlanSummaryCard plan={plan} />
      </div>
      <div className="detail-grid" style={{ marginTop: 14 }}>
        <EffortAllocator items={plan.effortAllocation} />
        <SuggestedFocusPanel actions={plan.suggestedActions} />
      </div>
    </main>
  );
}

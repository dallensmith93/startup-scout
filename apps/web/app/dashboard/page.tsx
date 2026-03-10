"use client";

import { useEffect, useState } from "react";
import { ActionQueuePreviewCard } from "../../components/dashboard/ActionQueuePreviewCard";
import { DashboardHero } from "../../components/dashboard/DashboardHero";
import { FollowupsDueCard } from "../../components/dashboard/FollowupsDueCard";
import { MomentumCard } from "../../components/dashboard/MomentumCard";
import { OpportunityDecayPanel } from "../../components/dashboard/OpportunityDecayPanel";
import { PipelineSnapshot } from "../../components/dashboard/PipelineSnapshot";
import { RiskAlertsCard } from "../../components/dashboard/RiskAlertsCard";
import { TopOpportunitiesCard } from "../../components/dashboard/TopOpportunitiesCard";
import { WeeklyFocusScoreCard } from "../../components/dashboard/WeeklyFocusScoreCard";
import { WhyStuckInsightCard } from "../../components/dashboard/WhyStuckInsightCard";
import { getDashboardData, type DashboardData } from "../../lib/dashboard-api";
import { getTaskData } from "../../lib/task-api";

export default function CommandDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [followups, setFollowups] = useState<Awaited<ReturnType<typeof getTaskData>>["followups"]>([]);

  useEffect(() => {
    void getDashboardData().then(setData);
    void getTaskData().then((x) => setFollowups(x.followups));
  }, []);

  if (!data) return <main><p className="empty">Loading command center...</p></main>;

  return (
    <main>
      <header className="page-head"><h2>Command Center</h2><p className="muted">System view of momentum, priorities, and risks.</p></header>
      <DashboardHero data={data} />
      <div className="detail-grid" style={{ marginTop: 14 }}>
        <WeeklyFocusScoreCard score={data.weeklyFocusScore} target={data.weeklyFocusTarget} reason={data.weeklyFocusReason} />
        <MomentumCard score={data.momentumScore} />
      </div>
      <div className="detail-grid" style={{ marginTop: 14 }}>
        <OpportunityDecayPanel items={data.opportunityDecay} />
        <ActionQueuePreviewCard items={data.actionQueuePreview} />
      </div>
      <div className="detail-grid" style={{ marginTop: 14 }}>
        <WhyStuckInsightCard insight={data.stuckInsight} />
        <FollowupsDueCard items={followups} />
      </div>
      <div className="detail-grid" style={{ marginTop: 14 }}>
        <TopOpportunitiesCard items={data.topOpportunities} />
        <RiskAlertsCard alerts={data.riskAlerts} />
      </div>
      <div style={{ marginTop: 14 }}><PipelineSnapshot items={data.pipelineSnapshot} /></div>
    </main>
  );
}

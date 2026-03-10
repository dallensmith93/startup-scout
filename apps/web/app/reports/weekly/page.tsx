"use client";

import { useEffect, useState } from "react";
import { BottlenecksPanel } from "../../../components/reports/BottlenecksPanel";
import { ConfidencePanel } from "../../../components/reports/ConfidencePanel";
import { NextWeekPlanPanel } from "../../../components/reports/NextWeekPlanPanel";
import { WeeklySummaryHeader } from "../../../components/reports/WeeklySummaryHeader";
import { WinsPanel } from "../../../components/reports/WinsPanel";
import { getWeeklyReportData, type WeeklyReportData } from "../../../lib/planner-api";

export default function WeeklyReportPage() {
  const [report, setReport] = useState<WeeklyReportData | null>(null);
  useEffect(() => {
    void getWeeklyReportData().then(setReport);
  }, []);
  if (!report) return <main><p className="empty">Loading weekly report...</p></main>;

  return (
    <main>
      <header className="page-head"><h2>Weekly Review</h2><p className="muted">Wins, risks, next steps, and confidence.</p></header>
      <WeeklySummaryHeader weekOf={report.weekOf} confidence={report.confidence} />
      <div className="detail-grid" style={{ marginTop: 14 }}>
        <WinsPanel wins={report.wins} />
        <BottlenecksPanel bottlenecks={report.risks} title="Risks" />
      </div>
      <div className="detail-grid detail-grid-wide" style={{ marginTop: 14 }}>
        <NextWeekPlanPanel items={report.nextSteps} title="Next Steps" />
        <ConfidencePanel confidence={report.confidence} reason={report.confidenceReason} />
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { FunnelBreakdown } from "../../components/analytics/FunnelBreakdown";
import { MetricsGrid } from "../../components/analytics/MetricsGrid";
import { OutreachInsightsPanel } from "../../components/analytics/OutreachInsightsPanel";
import { OutreachPerformanceCard } from "../../components/analytics/OutreachPerformanceCard";
import { ResponseRateCard } from "../../components/analytics/ResponseRateCard";
import { TrendCard } from "../../components/analytics/TrendCard";
import { getAnalyticsData, type AnalyticsData } from "../../lib/analytics-api";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  useEffect(() => {
    void getAnalyticsData().then(setData);
  }, []);
  if (!data) return <main><p className="empty">Loading analytics...</p></main>;

  return (
    <main>
      <header className="page-head"><h2>Job Search Analytics</h2><p className="muted">Measure funnel health and conversion momentum.</p></header>
      <MetricsGrid data={data} />
      <div className="detail-grid" style={{ marginTop: 14 }}>
        <ResponseRateCard responseRate={data.responseRate} />
        <TrendCard momentum={data.momentumScore} />
      </div>
      <div className="detail-grid detail-grid-wide" style={{ marginTop: 14 }}>
        <OutreachInsightsPanel data={data} />
        <OutreachPerformanceCard data={data} />
      </div>
      <div style={{ marginTop: 14 }}>
        <FunnelBreakdown data={data} />
      </div>
    </main>
  );
}

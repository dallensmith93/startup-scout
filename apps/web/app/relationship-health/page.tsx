"use client";

import { useEffect, useMemo, useState } from "react";
import { CoolingOffPanel } from "../../components/health/CoolingOffPanel";
import { FollowupUrgencyCard } from "../../components/health/FollowupUrgencyCard";
import { NeglectedLeadsPanel } from "../../components/health/NeglectedLeadsPanel";
import { RelationshipHealthCard } from "../../components/health/RelationshipHealthCard";
import { getRelationshipHealthData, type RelationshipHealthData } from "../../lib/relationship-api";

export default function RelationshipHealthPage() {
  const [data, setData] = useState<RelationshipHealthData | null>(null);

  useEffect(() => {
    void getRelationshipHealthData().then(setData);
  }, []);

  const topUrgency = useMemo(() => {
    if (!data?.followupUrgency.length) return null;
    return [...data.followupUrgency].sort((a, b) => b.urgencyScore - a.urgencyScore)[0];
  }, [data]);

  if (!data) return <main><p className="empty">Loading relationship health...</p></main>;

  return (
    <main>
      <header className="page-head">
        <h2>Relationship Health</h2>
        <p className="muted">Generated {new Date(data.generatedAt).toLocaleString()}</p>
      </header>
      <RelationshipHealthCard score={data.overallScore} summary={data.momentumSummary} />
      <div className="detail-grid" style={{ marginTop: 14 }}>
        <FollowupUrgencyCard item={topUrgency} />
        <CoolingOffPanel items={data.coolingOff} />
      </div>
      <div style={{ marginTop: 14 }}>
        <NeglectedLeadsPanel items={data.neglectedLeads} />
      </div>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { BriefFilterBar } from "../../components/brief/BriefFilterBar";
import { BriefHero } from "../../components/brief/BriefHero";
import { BriefSignalsPanel } from "../../components/brief/BriefSignalsPanel";
import { FocusBlocksPanel } from "../../components/brief/FocusBlocksPanel";
import { getDailyBriefData, type DailyBriefData } from "../../lib/brief-api";

export default function DailyBriefPage() {
  const [data, setData] = useState<DailyBriefData | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    void getDailyBriefData().then(setData);
  }, []);

  const filteredBlocks = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data.focusBlocks;
    return data.focusBlocks.filter((block) => block.type === filter);
  }, [data, filter]);

  if (!data) return <main><p className="empty">Loading daily brief...</p></main>;

  return (
    <main className="brief-page">
      <header className="page-head">
        <h2>Daily Brief</h2>
        <p className="muted">High-leverage actions with explainable reasoning.</p>
      </header>
      <BriefHero data={data} />
      <BriefFilterBar value={filter} onChange={setFilter} />
      <div className="detail-grid detail-grid-wide">
        <FocusBlocksPanel blocks={filteredBlocks} />
        <BriefSignalsPanel signals={data.signals} risks={data.risks} />
      </div>
      <section className="card" style={{ marginTop: 14 }}>
        <h3>Data note</h3>
        <p>{data.reason}</p>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { PriorityQueue } from "../../components/priorities/PriorityQueue";
import { ScoreBreakdownPanel } from "../../components/priorities/ScoreBreakdownPanel";
import { WhyNowCard } from "../../components/priorities/WhyNowCard";
import { getPriorityData, type PrioritiesData } from "../../lib/priority-api";

export default function PrioritiesPage() {
  const [data, setData] = useState<PrioritiesData | null>(null);

  useEffect(() => {
    void getPriorityData().then(setData);
  }, []);

  const decaySummary = useMemo(() => {
    if (!data || data.queue.length === 0) return "No decay signals detected.";
    const highest = data.queue.reduce((current, item) => item.decayScore > current.decayScore ? item : current, data.queue[0]);
    return `${highest.startupName} is decaying fastest (${highest.decayScore}) with a ${highest.urgencyWindow} action window.`;
  }, [data]);

  if (!data) return <main><p className="empty">Loading priorities...</p></main>;

  return (
    <main>
      <header className="page-head"><h2>Priority Queue</h2><p className="muted">Rank opportunities by fit, risk, urgency, and decay.</p></header>
      <section className="card" style={{ marginBottom: 14 }}>
        <div className="row-end" style={{ alignItems: "flex-start" }}>
          <div>
            <h3 style={{ margin: 0 }}>Why-Now + Decay Update</h3>
            <p className="muted" style={{ margin: "6px 0 0" }}>{decaySummary}</p>
          </div>
          <span className="status-pill rejected">Execution required</span>
        </div>
      </section>
      <div className="detail-grid">
        <WhyNowCard item={data.queue[0]} />
        <ScoreBreakdownPanel items={data.queue} />
      </div>
      <div style={{ marginTop: 14 }}><PriorityQueue items={data.queue} /></div>
    </main>
  );
}

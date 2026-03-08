"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { RankingItem } from "../../lib/types";
import ScoreBadge from "../../components/ScoreBadge";

export default function RankingsPage() {
  const [rows, setRows] = useState<RankingItem[]>([]);

  useEffect(() => {
    api.rankings().then(setRows);
  }, []);

  return (
    <main>
      <header className="page-head">
        <h2>Opportunity Rankings</h2>
        <p className="muted">Transparent score breakdown across traction, hiring, and founder signals.</p>
      </header>
      <div className="table-card">
        <div className="table-head">
          <span>Rank</span><span>Startup</span><span>Score</span><span>Breakdown</span>
        </div>
        {rows.map((row) => (
          <div key={row.id} className="table-row">
            <span>#{row.rank}</span>
            <span>{row.name}</span>
            <ScoreBadge score={row.score} />
            <span className="muted">
              Market {row.scoreBreakdown.marketFit} � Hiring {row.scoreBreakdown.hiringSignal} � AI {row.scoreBreakdown.aiDepth}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}

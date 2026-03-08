"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api";
import type { StartupRecord } from "../../../lib/types";
import ScoreBadge from "../../../components/ScoreBadge";

export default function StartupDetailPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<StartupRecord | null>(null);

  useEffect(() => {
    if (params?.id) api.startupById(params.id).then(setItem);
  }, [params]);

  if (!item) return <p className="empty">Loading startup profile...</p>;

  return (
    <main>
      <header className="page-head">
        <h2>{item.name}</h2>
        <ScoreBadge score={item.score} />
      </header>
      <section className="detail-grid">
        <article className="card">
          <h3>AI Intelligence Summary</h3>
          <p>{item.intelligence.summary}</p>
          <ul>
            {item.whyNow.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h3>Founder Signals</h3>
          <ul>
            {item.intelligence.founderSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
          <p className="muted">Hiring probability: {item.intelligence.hiringProbability}%</p>
        </article>
      </section>
    </main>
  );
}

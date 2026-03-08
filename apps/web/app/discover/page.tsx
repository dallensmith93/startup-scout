"use client";

import { useEffect, useMemo, useState } from "react";
import StartupCard from "../../components/StartupCard";
import { api } from "../../lib/api";
import type { StartupRecord } from "../../lib/types";

export default function DiscoverPage() {
  const [items, setItems] = useState<StartupRecord[]>([]);
  const [query, setQuery] = useState("");
  const [minScore, setMinScore] = useState(60);

  useEffect(() => {
    api.startups().then(setItems);
  }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (s) =>
          s.score >= minScore &&
          `${s.name} ${s.description} ${s.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())
      ),
    [items, minScore, query]
  );

  return (
    <main>
      <header className="page-head">
        <h2>Discover</h2>
        <p className="muted">Search, filter, and inspect startup opportunities.</p>
      </header>
      <section className="toolbar-card">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search startup, tags, or thesis" />
        <label>
          Min Score: {minScore}
          <input type="range" min={40} max={100} value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} />
        </label>
      </section>
      <div className="grid">
        {filtered.map((s) => (
          <StartupCard key={s.id} startup={s} />
        ))}
      </div>
      {filtered.length === 0 && <p className="empty">No matches. Try lowering min score.</p>}
    </main>
  );
}

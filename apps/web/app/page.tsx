"use client";

import { useEffect, useState } from "react";
import StartupCard from "../components/StartupCard";
import { api } from "../lib/api";
import type { StartupRecord } from "../lib/types";

export default function HomePage() {
  const [items, setItems] = useState<StartupRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.startups().then(setItems).finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <header className="page-head">
        <h2>Home</h2>
        <p className="muted">Your highest-signal opportunities across AI startups.</p>
      </header>
      {loading && <p className="empty">Loading startup intelligence...</p>}
      {!loading && items.length === 0 && <p className="empty">No startup data yet. Start the backend and refresh.</p>}
      <div className="grid">
        {items.slice(0, 6).map((s) => (
          <StartupCard key={s.id} startup={s} />
        ))}
      </div>
    </main>
  );
}

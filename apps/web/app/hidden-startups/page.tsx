"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { HiddenSignal } from "../../lib/types";

export default function HiddenStartupsPage() {
  const [signals, setSignals] = useState<HiddenSignal[]>([]);

  useEffect(() => {
    api.hiddenStartups().then(setSignals);
  }, []);

  return (
    <main>
      <header className="page-head">
        <h2>Hidden Startup Finder</h2>
        <p className="muted">Signals you likely would not catch in a normal job board scan.</p>
      </header>
      {signals.length === 0 && <p className="empty">No hidden signals found yet.</p>}
      <div className="grid">
        {signals.map((s) => (
          <article className="card" key={s.id}>
            <h3>{s.startupName}</h3>
            <p>{s.signal}</p>
            <p className="muted">Confidence: {Math.round(s.confidence * 100)}%</p>
            <p><strong>Why this matters:</strong> {s.whyItMatters}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

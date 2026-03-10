"use client";

import { type BulletSuggestion } from "../../lib/tailoring-api";

type SuggestedBulletsPanelProps = {
  bullets: BulletSuggestion[];
};

async function copyText(value: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    // no-op
  }
}

export function SuggestedBulletsPanel({ bullets }: SuggestedBulletsPanelProps) {
  const copyBody = bullets.map((b) => `- ${b.after}`).join("\n");

  return (
    <section className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>Suggested Bullets</h3>
        <button className="link-btn" onClick={() => void copyText(copyBody)}>
          Copy Bullet Set
        </button>
      </div>
      <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
        {bullets.map((bullet, idx) => (
          <article key={`${idx}-${bullet.after.slice(0, 20)}`} className="table-card">
            <div className="table-head" style={{ gridTemplateColumns: "1fr" }}>
              <span>Upgrade #{idx + 1}</span>
            </div>
            <div style={{ padding: 12, borderTop: "1px solid #22304b" }}>
              <p className="muted" style={{ marginTop: 0 }}>
                Before
              </p>
              <p style={{ marginTop: 0 }}>{bullet.before}</p>
              <p className="muted" style={{ marginBottom: 5 }}>
                After
              </p>
              <p style={{ marginTop: 0, color: "#eaf8ff" }}>{bullet.after}</p>
              <p className="muted" style={{ marginBottom: 0 }}>
                Why: {bullet.rationale}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


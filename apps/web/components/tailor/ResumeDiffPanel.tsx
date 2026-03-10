"use client";

import { type ResumeDiffSection } from "../../lib/tailoring-api";

type ResumeDiffPanelProps = {
  diffs: ResumeDiffSection[];
};

async function copyText(value: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    // Ignore clipboard failures to keep UX non-blocking.
  }
}

export function ResumeDiffPanel({ diffs }: ResumeDiffPanelProps) {
  const allTailored = diffs.map((d) => `${d.section}\n${d.tailored}`).join("\n\n");

  return (
    <section className="card" style={{ gridColumn: "1 / -1" }}>
      <div className="row-end" style={{ marginBottom: 10 }}>
        <h3 style={{ margin: 0 }}>Resume Diff</h3>
        <button className="link-btn" onClick={() => void copyText(allTailored)}>
          Copy All Tailored Sections
        </button>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))" }}>
        {diffs.map((diff) => (
          <article key={diff.section} className="table-card" style={{ background: "rgba(11,18,32,.7)" }}>
            <div className="table-head" style={{ gridTemplateColumns: "1fr auto" }}>
              <span>{diff.section}</span>
              <button
                className="link-btn"
                style={{ padding: "5px 8px", fontSize: 12 }}
                onClick={() => void copyText(diff.tailored)}
              >
                Copy
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: 12, borderRight: "1px solid #22304b" }}>
                <p className="muted" style={{ marginTop: 0 }}>
                  Before
                </p>
                <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.4 }}>{diff.original}</p>
              </div>
              <div style={{ padding: 12, background: "rgba(21,39,62,.35)" }}>
                <p className="muted" style={{ marginTop: 0 }}>
                  After
                </p>
                <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.4 }}>{diff.tailored}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


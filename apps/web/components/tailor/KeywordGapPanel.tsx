"use client";

import { type KeywordGap } from "../../lib/tailoring-api";

type KeywordGapPanelProps = {
  keywordGaps: KeywordGap[];
};

async function copyText(value: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    // no-op
  }
}

export function KeywordGapPanel({ keywordGaps }: KeywordGapPanelProps) {
  const missing = keywordGaps.filter((k) => !k.present);
  const copyBody = missing.map((k) => `- ${k.keyword}: ${k.suggestion}`).join("\n");

  return (
    <section className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>Keyword Gaps</h3>
        <button className="link-btn" onClick={() => void copyText(copyBody)} disabled={missing.length === 0}>
          Copy Missing Keyword Notes
        </button>
      </div>
      <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
        {keywordGaps.map((item) => (
          <div
            key={item.keyword}
            className="row-end"
            style={{
              border: "1px solid #243554",
              borderRadius: 10,
              padding: "10px 12px",
              background: item.present ? "rgba(89,228,168,.09)" : "rgba(246,200,106,.1)"
            }}
          >
            <div>
              <strong>{item.keyword}</strong>
              <p className="muted" style={{ margin: "3px 0 0" }}>
                {item.suggestion}
              </p>
            </div>
            <span className={item.present ? "score-badge high" : "score-badge mid"}>{item.present ? "Found" : "Missing"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}


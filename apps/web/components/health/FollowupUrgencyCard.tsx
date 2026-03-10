"use client";

import { useState } from "react";
import type { FollowupUrgency } from "../../lib/relationship-api";

type FollowupUrgencyCardProps = {
  item: FollowupUrgency | null;
};

async function copyText(value: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function FollowupUrgencyCard({ item }: FollowupUrgencyCardProps) {
  const [copied, setCopied] = useState(false);
  if (!item) return <p className="empty">No urgent follow-ups right now.</p>;

  return (
    <section className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>Highest urgency follow-up</h3>
        <span className="score-badge low">{item.urgencyScore}</span>
      </div>
      <p className="muted" style={{ marginTop: 8 }}>{item.contactName} | {item.company} | Due {item.deadlineDate}</p>
      <p>{item.rationale}</p>
      <textarea rows={5} value={item.copyReadyFollowup} readOnly />
      <button
        type="button"
        className="link-btn"
        style={{ marginTop: 8 }}
        onClick={async () => {
          const ok = await copyText(item.copyReadyFollowup);
          setCopied(ok);
        }}
      >
        Copy follow-up
      </button>
      {copied ? <p className="muted" style={{ marginBottom: 0 }}>Copied follow-up text.</p> : null}
    </section>
  );
}

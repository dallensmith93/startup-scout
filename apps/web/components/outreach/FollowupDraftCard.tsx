"use client";

import { useState } from "react";
import type { FollowupDraft } from "../../lib/outreach-api";

type FollowupDraftCardProps = {
  item: FollowupDraft;
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

export function FollowupDraftCard({ item }: FollowupDraftCardProps) {
  const [copied, setCopied] = useState(false);
  return (
    <article className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>{item.contactName}</h3>
        <span className="chip">{item.company}</span>
      </div>
      <p className="muted" style={{ marginTop: 8 }}>Why now: {item.whyNow}</p>
      <textarea rows={5} value={item.draft} readOnly />
      <button
        type="button"
        className="link-btn"
        style={{ marginTop: 8 }}
        onClick={async () => {
          const ok = await copyText(item.draft);
          setCopied(ok);
        }}
      >
        Copy follow-up draft
      </button>
      {copied ? <p className="muted" style={{ marginBottom: 0 }}>Copied draft.</p> : null}
    </article>
  );
}

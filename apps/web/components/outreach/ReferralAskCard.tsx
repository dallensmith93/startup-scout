"use client";

import { useState } from "react";
import type { ReferralAsk } from "../../lib/outreach-api";

type ReferralAskCardProps = {
  item: ReferralAsk;
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

export function ReferralAskCard({ item }: ReferralAskCardProps) {
  const [copied, setCopied] = useState(false);

  const fullCopy = `${item.ask}\n\nSupporting proof: ${item.supportingProof}`;

  return (
    <article className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>{item.contactName}</h3>
        <span className="chip">Referral ask</span>
      </div>
      <p className="muted" style={{ marginTop: 8 }}>{item.targetRole}</p>
      <p>{item.ask}</p>
      <p className="muted">Proof point: {item.supportingProof}</p>
      <button
        type="button"
        className="link-btn"
        onClick={async () => {
          const ok = await copyText(fullCopy);
          setCopied(ok);
        }}
      >
        Copy referral ask
      </button>
      {copied ? <p className="muted" style={{ marginBottom: 0 }}>Copied referral ask.</p> : null}
    </article>
  );
}

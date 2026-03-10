"use client";

import { useState } from "react";
import type { WarmPath } from "../../lib/network-api";

type WarmPathCardProps = {
  item: WarmPath;
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

export function WarmPathCard({ item }: WarmPathCardProps) {
  const [copied, setCopied] = useState(false);

  return (
    <article className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>{item.targetCompany}</h3>
        <span className="chip">{item.introLikelihood}%</span>
      </div>
      <p className="muted" style={{ marginTop: 8 }}>{item.targetRole}</p>
      <p>{item.pathSummary}</p>
      <p className="muted">Next step: {item.nextStep}</p>
      <textarea rows={5} value={item.introDraft} readOnly />
      <button
        type="button"
        className="link-btn"
        style={{ marginTop: 8 }}
        onClick={async () => {
          const ok = await copyText(item.introDraft);
          setCopied(ok);
        }}
      >
        Copy intro draft
      </button>
      {copied ? <p className="muted" style={{ marginBottom: 0 }}>Copied intro draft.</p> : null}
    </article>
  );
}

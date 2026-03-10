"use client";

import { useState } from "react";

type NextActionPanelProps = {
  action: string;
  reason: string;
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

export function NextActionPanel({ action, reason }: NextActionPanelProps) {
  const [copied, setCopied] = useState(false);

  return (
    <section className="card">
      <h4 style={{ marginTop: 0 }}>Best Next Action</h4>
      <p>{action}</p>
      <p className="muted">Reason: {reason}</p>
      <button
        type="button"
        className="link-btn"
        onClick={async () => {
          const ok = await copyText(action);
          setCopied(ok);
        }}
      >
        Copy Action
      </button>
      {copied ? <p className="muted" style={{ marginBottom: 0 }}>Copied next action.</p> : null}
    </section>
  );
}

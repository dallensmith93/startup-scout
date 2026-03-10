"use client";

import { useState } from "react";
import type { Connection } from "../../lib/network-api";

type ContactQuickViewProps = {
  contact: Connection | null;
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

export function ContactQuickView({ contact }: ContactQuickViewProps) {
  const [copied, setCopied] = useState<"" | "followup" | "ask">("");

  if (!contact) return <p className="empty">Select a contact to see quick actions.</p>;

  const followupCopy = `Hi ${contact.name.split(" ")[0]}, quick update from me: ${contact.notes} If useful, I can send a short summary this week.`;
  const askCopy = `Hi ${contact.name.split(" ")[0]}, would you be open to advising on the best path for ${contact.company}? Your perspective would help me target my next step.`;

  return (
    <section className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>{contact.name}</h3>
        <span className="chip">{contact.preferredChannel}</span>
      </div>
      <p className="muted" style={{ margin: "8px 0 0" }}>{contact.role} at {contact.company}</p>

      <article style={{ marginTop: 12 }}>
        <h4 style={{ margin: "0 0 6px" }}>Next Action</h4>
        <p style={{ margin: 0 }}>{contact.nextAction}</p>
      </article>

      <article style={{ marginTop: 12 }}>
        <h4 style={{ margin: "0 0 6px" }}>Copy-ready follow-up</h4>
        <textarea rows={4} value={followupCopy} readOnly />
        <button
          type="button"
          className="link-btn"
          style={{ marginTop: 8 }}
          onClick={async () => {
            const ok = await copyText(followupCopy);
            setCopied(ok ? "followup" : "");
          }}
        >
          Copy follow-up
        </button>
      </article>

      <article style={{ marginTop: 12 }}>
        <h4 style={{ margin: "0 0 6px" }}>Copy-ready ask</h4>
        <textarea rows={4} value={askCopy} readOnly />
        <button
          type="button"
          className="link-btn"
          style={{ marginTop: 8 }}
          onClick={async () => {
            const ok = await copyText(askCopy);
            setCopied(ok ? "ask" : "");
          }}
        >
          Copy ask
        </button>
      </article>
      {copied ? <p className="muted" style={{ marginBottom: 0 }}>Copied {copied} text.</p> : null}
    </section>
  );
}

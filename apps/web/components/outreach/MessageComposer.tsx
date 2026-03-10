"use client";

import { useEffect, useMemo, useState } from "react";
import type { OutreachTemplate } from "../../lib/outreach-api";

type MessageComposerProps = {
  templates: OutreachTemplate[];
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

export function MessageComposer({ templates }: MessageComposerProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id ?? "");
  const [body, setBody] = useState<string>(templates[0]?.body ?? "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const template = templates.find((item) => item.id === selectedTemplateId) ?? templates[0];
    if (!template) return;
    setBody(template.body);
  }, [selectedTemplateId, templates]);

  const template = useMemo(
    () => templates.find((item) => item.id === selectedTemplateId) ?? templates[0],
    [selectedTemplateId, templates]
  );

  if (!template) return <p className="empty">No templates available.</p>;

  return (
    <section className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>Message Composer</h3>
        <span className="chip">{template.channel}</span>
      </div>
      <label style={{ display: "grid", gap: 8, marginTop: 10 }}>
        Template
        <select value={selectedTemplateId} onChange={(event) => setSelectedTemplateId(event.target.value)}>
          {templates.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label} ({item.contextTag})
            </option>
          ))}
        </select>
      </label>
      <label style={{ display: "grid", gap: 8, marginTop: 10 }}>
        Subject
        <input value={template.subject} readOnly />
      </label>
      <label style={{ display: "grid", gap: 8, marginTop: 10 }}>
        Body
        <textarea rows={10} value={body} onChange={(event) => setBody(event.target.value)} />
      </label>
      <div className="row-end" style={{ marginTop: 10 }}>
        <span className="muted">{body.length} chars</span>
        <button
          type="button"
          className="link-btn"
          onClick={async () => {
            const ok = await copyText(body);
            setCopied(ok);
          }}
        >
          Copy message
        </button>
      </div>
      {copied ? <p className="muted" style={{ marginBottom: 0 }}>Copied message text.</p> : null}
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { OutreachResponse, StartupRecord } from "../../lib/types";

export default function OutreachPage() {
  const [startups, setStartups] = useState<StartupRecord[]>([]);
  const [startupId, setStartupId] = useState("");
  const [tone, setTone] = useState<"direct" | "warm" | "technical">("warm");
  const [pitch, setPitch] = useState("Built AI automation workflows and shipped production copilots.");
  const [output, setOutput] = useState<OutreachResponse | null>(null);

  useEffect(() => {
    api.startups().then((rows) => {
      setStartups(rows);
      setStartupId(rows[0]?.id ?? "");
    });
  }, []);

  async function generate() {
    if (!startupId) return;
    const result = await api.outreach({
      startupId,
      tone,
      candidateName: "Your Name",
      candidatePitch: pitch
    });
    setOutput(result);
  }

  return (
    <main>
      <header className="page-head">
        <h2>Founder Outreach Generator</h2>
        <p className="muted">Generate then edit your message before sending.</p>
      </header>
      <section className="detail-grid">
        <article className="card">
          <label>Startup
            <select value={startupId} onChange={(e) => setStartupId(e.target.value)}>
              {startups.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label>Tone
            <select value={tone} onChange={(e) => setTone(e.target.value as "direct" | "warm" | "technical")}>
              <option value="warm">Warm</option>
              <option value="direct">Direct</option>
              <option value="technical">Technical</option>
            </select>
          </label>
          <label>Candidate pitch
            <textarea value={pitch} onChange={(e) => setPitch(e.target.value)} rows={6} />
          </label>
          <button className="link-btn" onClick={() => generate()}>Generate Outreach</button>
        </article>
        <article className="card">
          <h3>Editable Output</h3>
          {!output && <p className="empty">Generate a message to preview.</p>}
          {output && (
            <>
              <p><strong>Subject:</strong> {output.subject}</p>
              <textarea value={output.message} onChange={(e) => setOutput({ ...output, message: e.target.value })} rows={10} />
              <ul>{output.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
            </>
          )}
        </article>
      </section>
    </main>
  );
}

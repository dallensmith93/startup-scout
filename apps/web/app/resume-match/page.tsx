"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { ResumeMatchResponse, StartupRecord } from "../../lib/types";

export default function ResumeMatchPage() {
  const [startups, setStartups] = useState<StartupRecord[]>([]);
  const [startupId, setStartupId] = useState("");
  const [skills, setSkills] = useState("python, fastapi, llm, product analytics");
  const [resumeText, setResumeText] = useState("Built AI features for B2B SaaS, shipped search and recommendation systems.");
  const [result, setResult] = useState<ResumeMatchResponse | null>(null);

  useEffect(() => {
    api.startups().then((rows) => {
      setStartups(rows);
      setStartupId(rows[0]?.id ?? "");
    });
  }, []);

  async function analyze() {
    const response = await api.resumeMatch({
      startupId,
      resumeText,
      keySkills: skills.split(",").map((s) => s.trim()).filter(Boolean)
    });
    setResult(response);
  }

  return (
    <main>
      <header className="page-head">
        <h2>Resume Match Analyzer</h2>
        <p className="muted">Quantify fit score and identify concrete skill gaps.</p>
      </header>
      <section className="detail-grid">
        <article className="card">
          <label>Startup
            <select value={startupId} onChange={(e) => setStartupId(e.target.value)}>
              {startups.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label>Key skills (comma separated)
            <input value={skills} onChange={(e) => setSkills(e.target.value)} />
          </label>
          <label>Resume text
            <textarea rows={8} value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
          </label>
          <button className="link-btn" onClick={() => analyze()}>Analyze Match</button>
        </article>
        <article className="card">
          {!result && <p className="empty">Run an analysis to view fit score.</p>}
          {result && (
            <>
              <h3>Fit Score: {result.fitScore}</h3>
              <p><strong>Strengths</strong></p>
              <ul>{result.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
              <p><strong>Skill gaps</strong></p>
              <ul>{result.skillGaps.map((s) => <li key={s}>{s}</li>)}</ul>
            </>
          )}
        </article>
      </section>
    </main>
  );
}

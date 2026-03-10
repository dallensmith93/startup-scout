"use client";

import { useEffect, useMemo, useState } from "react";
import { IntroGeneratorPanel } from "../../components/tailor/IntroGeneratorPanel";
import { KeywordGapPanel } from "../../components/tailor/KeywordGapPanel";
import { ResumeDiffPanel } from "../../components/tailor/ResumeDiffPanel";
import { SuggestedBulletsPanel } from "../../components/tailor/SuggestedBulletsPanel";
import { TailorForm } from "../../components/tailor/TailorForm";
import { type TailorInput, type TailorResult, tailorResume } from "../../lib/tailoring-api";

const DRAFT_KEY = "phase4.tailor.draft";
const RESULT_KEY = "phase4.tailor.result";

const DEFAULT_INPUT: TailorInput = {
  jobTitle: "Product Analyst",
  company: "Northstar AI",
  jobDescription:
    "Looking for an analyst who can build dashboards, run SQL, align with hiring managers, and turn ambiguous requirements into clear deliverables.",
  resumeText:
    "Built KPI dashboards in Looker. Wrote SQL to measure activation and retention. Partnered with recruiting team and operations to improve pipeline conversion by 23%.",
  tone: "impact",
  introPrompt: "Brief, direct, and outcomes-focused."
};

export default function TailorPage() {
  const [input, setInput] = useState<TailorInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<TailorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const draftRaw = localStorage.getItem(DRAFT_KEY);
    const resultRaw = localStorage.getItem(RESULT_KEY);
    if (draftRaw) {
      try {
        const parsed = JSON.parse(draftRaw) as Partial<TailorInput>;
        setInput({ ...DEFAULT_INPUT, ...parsed });
      } catch {
        localStorage.removeItem(DRAFT_KEY);
      }
    }
    if (resultRaw) {
      try {
        setResult(JSON.parse(resultRaw) as TailorResult);
      } catch {
        localStorage.removeItem(RESULT_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(input));
  }, [input]);

  const sourceBadge = useMemo(() => {
    if (!result) {
      return null;
    }
    return result.source === "api" ? "Live API" : "Deterministic fallback";
  }, [result]);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await tailorResume(input);
      setResult(next);
      localStorage.setItem(RESULT_KEY, JSON.stringify(next));
      if (next.source !== "api") {
        setError("API unavailable. Showing deterministic fallback output.");
      }
    } catch {
      setError("Could not generate results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <header className="page-head">
        <div>
          <h2>Resume Tailor</h2>
          <p className="muted">Generate copy-ready bullet upgrades, keyword fixes, and a polished intro.</p>
        </div>
        {sourceBadge && <span className="chip">{sourceBadge}</span>}
      </header>
      <section className="card" style={{ marginBottom: 14 }}>
        <TailorForm input={input} onChange={setInput} onSubmit={handleRun} loading={loading} />
      </section>
      {error && (
        <p className="empty" style={{ marginBottom: 14, borderStyle: "solid", borderColor: "rgba(246,200,106,.45)" }}>
          {error}
        </p>
      )}
      {!result && <p className="empty">Run Resume Tailor to generate your tailored brief.</p>}
      {result && (
        <div className="grid">
          <IntroGeneratorPanel intro={result.intro} summary={result.summary} />
          <KeywordGapPanel keywordGaps={result.keywordGaps} />
          <SuggestedBulletsPanel bullets={result.bullets} />
          <ResumeDiffPanel diffs={result.diffs} />
        </div>
      )}
    </main>
  );
}

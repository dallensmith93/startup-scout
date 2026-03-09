"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfidenceMeter from "../../components/legitimacy/ConfidenceMeter";
import LegitimacyForm from "../../components/legitimacy/LegitimacyForm";
import LegitimacyScoreCard from "../../components/legitimacy/LegitimacyScoreCard";
import RecommendedActionCard from "../../components/legitimacy/RecommendedActionCard";
import RedFlagsPanel from "../../components/legitimacy/RedFlagsPanel";
import RiskBreakdown from "../../components/legitimacy/RiskBreakdown";
import TrustSignalsPanel from "../../components/legitimacy/TrustSignalsPanel";
import { legitimacyApi } from "../../lib/legitimacy-api";
import type { LegitimacyInput, LegitimacyResult } from "../../lib/legitimacy-types";

const initial: LegitimacyInput = {
  jobTitle: "",
  companyName: "",
  jobDescription: "",
  salaryRange: "",
  recruiterMessage: "",
  postingUrl: "",
  companyWebsite: "",
  notes: ""
};

export default function LegitimacyPage() {
  const [input, setInput] = useState<LegitimacyInput>(initial);
  const [result, setResult] = useState<LegitimacyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onAnalyze() {
    setLoading(true);
    const res = await legitimacyApi.analyzeLegitimacy(input);
    setResult(res);
    localStorage.setItem(`job-report:${res.reportId}`, JSON.stringify({ result: res, input }));
    setLoading(false);
  }

  return (
    <main>
      <header className="page-head">
        <h2>Job Legitimacy Checker</h2>
        <p className="muted">Evaluate trust, risk, and next actions with explainable heuristics.</p>
      </header>
      <section className="detail-grid">
        <LegitimacyForm value={input} onChange={setInput} onSubmit={onAnalyze} loading={loading} />
        <article className="card">
          {!result && <p className="empty">Run an analysis to generate a legitimacy report.</p>}
          {result && (
            <>
              <LegitimacyScoreCard result={result} />
              <ConfidenceMeter value={result.confidence} />
              <button className="link-btn" onClick={() => router.push(`/job-report/${result.reportId}`)}>Open Full Report</button>
            </>
          )}
        </article>
      </section>
      {result && (
        <section className="detail-grid">
          <TrustSignalsPanel items={result.trustSignals} />
          <RedFlagsPanel items={result.redFlags} />
          <RiskBreakdown result={result} />
          <RecommendedActionCard action={result.recommendedAction} summary={result.explanationSummary} />
        </section>
      )}
    </main>
  );
}

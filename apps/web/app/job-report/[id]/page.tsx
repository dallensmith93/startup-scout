"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import EvidenceSection from "../../../components/report/EvidenceSection";
import ReportHeader from "../../../components/report/ReportHeader";
import VerdictBanner from "../../../components/report/VerdictBanner";
import type { LegitimacyInput, LegitimacyResult } from "../../../lib/legitimacy-types";

type StoredReport = { result: LegitimacyResult; input: LegitimacyInput };

export default function JobReportPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<StoredReport | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    const raw = localStorage.getItem(`job-report:${params.id}`);
    if (raw) setData(JSON.parse(raw) as StoredReport);
  }, [params]);

  if (!data) {
    return (
      <main>
        <p className="empty">Report not found. Run a legitimacy analysis first to generate this report.</p>
      </main>
    );
  }

  return (
    <main>
      <ReportHeader result={data.result} />
      <VerdictBanner result={data.result} />
      <section className="detail-grid">
        <article className="card">
          <h3>Input Snapshot</h3>
          <p><strong>Job title:</strong> {data.input.jobTitle}</p>
          <p><strong>Company:</strong> {data.input.companyName}</p>
          <p><strong>Salary:</strong> {data.input.salaryRange || "Not provided"}</p>
          <p><strong>Posting URL:</strong> {data.input.postingUrl || "Not provided"}</p>
        </article>
        <EvidenceSection result={data.result} />
      </section>
      <article className="card">
        <h3>Suggested Follow-up Questions</h3>
        <ul>{data.result.suggestedFollowupQuestions.map((q) => <li key={q}>{q}</li>)}</ul>
      </article>
    </main>
  );
}

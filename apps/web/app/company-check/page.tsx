"use client";

import { useState } from "react";
import CompanyCheckForm from "../../components/company/CompanyCheckForm";
import CompanySurfacePanel from "../../components/company/CompanySurfacePanel";
import DomainTrustCard from "../../components/company/DomainTrustCard";
import { legitimacyApi } from "../../lib/legitimacy-api";
import type { CompanyCheckInput, CompanyCheckResult } from "../../lib/legitimacy-types";

const initial: CompanyCheckInput = { companyName: "", website: "", domain: "", postingUrl: "" };

export default function CompanyCheckPage() {
  const [input, setInput] = useState<CompanyCheckInput>(initial);
  const [result, setResult] = useState<CompanyCheckResult | null>(null);

  async function run() {
    const res = await legitimacyApi.analyzeCompany(input);
    setResult(res);
  }

  return (
    <main>
      <header className="page-head">
        <h2>Company Credibility Check</h2>
        <p className="muted">Validate company surface trust before investing time in interviews.</p>
      </header>
      <section className="detail-grid">
        <CompanyCheckForm value={input} onChange={setInput} onSubmit={run} />
        <DomainTrustCard result={result} />
      </section>
      <CompanySurfacePanel result={result} />
    </main>
  );
}

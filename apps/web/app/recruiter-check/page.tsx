"use client";

import { useState } from "react";
import FollowupQuestionsPanel from "../../components/recruiter/FollowupQuestionsPanel";
import MessageAnalysisCard from "../../components/recruiter/MessageAnalysisCard";
import RecruiterMessageInput from "../../components/recruiter/RecruiterMessageInput";
import { legitimacyApi } from "../../lib/legitimacy-api";
import type { RecruiterCheckResult } from "../../lib/legitimacy-types";

export default function RecruiterCheckPage() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<RecruiterCheckResult | null>(null);

  async function runCheck() {
    const response = await legitimacyApi.analyzeRecruiter({ message });
    setResult(response);
  }

  return (
    <main>
      <header className="page-head">
        <h2>Recruiter Message Check</h2>
        <p className="muted">Assess recruiter outreach quality and detect suspicious patterns.</p>
      </header>
      <section className="detail-grid">
        <article className="card form-grid">
          <RecruiterMessageInput message={message} onChange={setMessage} />
          <button className="link-btn" onClick={runCheck} disabled={!message.trim()}>Analyze Message</button>
        </article>
        <MessageAnalysisCard result={result} />
      </section>
      {result && <FollowupQuestionsPanel questions={result.followupQuestions} />}
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { InterviewPrepCard } from "../../components/interview/InterviewPrepCard";
import { LikelyQuestionsPanel } from "../../components/interview/LikelyQuestionsPanel";
import { QuestionsForThemPanel } from "../../components/interview/QuestionsForThemPanel";
import { TalkingPointsPanel } from "../../components/interview/TalkingPointsPanel";
import { generateInterviewPrep, type InterviewInput, type InterviewPrepResult } from "../../lib/interview-api";

const DRAFT_KEY = "phase4.interview.draft";
const RESULT_KEY = "phase4.interview.result";

const DEFAULT_INPUT: InterviewInput = {
  company: "Northstar AI",
  role: "Product Analyst",
  interviewerName: "Hiring Manager",
  jobDescription:
    "Need someone who can synthesize data, lead cross-functional planning, and communicate clearly with stakeholders.",
  resumeHighlights:
    "Built KPI dashboards, improved conversion by 23%, and partnered with recruiting + operations on process improvements."
};

export default function InterviewPrepPage() {
  const [input, setInput] = useState<InterviewInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<InterviewPrepResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const rawDraft = localStorage.getItem(DRAFT_KEY);
    const rawResult = localStorage.getItem(RESULT_KEY);
    if (rawDraft) {
      try {
        setInput({ ...DEFAULT_INPUT, ...(JSON.parse(rawDraft) as Partial<InterviewInput>) });
      } catch {
        localStorage.removeItem(DRAFT_KEY);
      }
    }
    if (rawResult) {
      try {
        setResult(JSON.parse(rawResult) as InterviewPrepResult);
      } catch {
        localStorage.removeItem(RESULT_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(input));
  }, [input]);

  const runPrep = async () => {
    setLoading(true);
    const next = await generateInterviewPrep(input);
    setResult(next);
    localStorage.setItem(RESULT_KEY, JSON.stringify(next));
    setLoading(false);
  };

  return (
    <main>
      <header className="page-head">
        <div>
          <h2>Interview Prep</h2>
          <p className="muted">Generate concise talking points, likely questions, and strong questions to ask.</p>
        </div>
        {result && <span className="chip">{result.source === "api" ? "Live API" : "Deterministic fallback"}</span>}
      </header>
      <section className="card" style={{ marginBottom: 14 }}>
        <div className="detail-grid">
          <label>
            Company
            <input value={input.company} onChange={(e) => setInput({ ...input, company: e.target.value })} />
          </label>
          <label>
            Role
            <input value={input.role} onChange={(e) => setInput({ ...input, role: e.target.value })} />
          </label>
        </div>
        <div className="detail-grid" style={{ marginTop: 10 }}>
          <label>
            Interviewer
            <input value={input.interviewerName} onChange={(e) => setInput({ ...input, interviewerName: e.target.value })} />
          </label>
          <div />
        </div>
        <label style={{ display: "grid", gap: 8, marginTop: 10 }}>
          Job description
          <textarea
            rows={6}
            value={input.jobDescription}
            onChange={(e) => setInput({ ...input, jobDescription: e.target.value })}
            placeholder="Paste role requirements..."
          />
        </label>
        <label style={{ display: "grid", gap: 8, marginTop: 10 }}>
          Resume highlights
          <textarea
            rows={5}
            value={input.resumeHighlights}
            onChange={(e) => setInput({ ...input, resumeHighlights: e.target.value })}
            placeholder="Paste strongest outcomes..."
          />
        </label>
        <div className="row-end" style={{ marginTop: 10 }}>
          <span className="muted">Output is copy-ready for your notes doc.</span>
          <button className="link-btn" type="button" onClick={() => void runPrep()} disabled={loading}>
            {loading ? "Generating..." : "Generate Prep Brief"}
          </button>
        </div>
      </section>
      {!result && <p className="empty">Generate a prep brief to see talking points and interview questions.</p>}
      {result && (
        <div className="grid">
          <InterviewPrepCard pitch={result.thirtySecondPitch} source={result.source === "api" ? "Live API" : "Fallback"} />
          <TalkingPointsPanel points={result.talkingPoints} />
          <LikelyQuestionsPanel questions={result.likelyQuestions} />
          <QuestionsForThemPanel questions={result.questionsForThem} />
        </div>
      )}
    </main>
  );
}

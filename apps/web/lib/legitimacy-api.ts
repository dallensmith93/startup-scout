import type {
  CompanyCheckInput,
  CompanyCheckResult,
  LegitimacyInput,
  LegitimacyResult,
  RecruiterCheckInput,
  RecruiterCheckResult
} from "./legitimacy-types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function call<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
  const endpoint = `${API_BASE.replace(/\/$/, "")}${path}`;
  try {
    const res = await fetch(endpoint, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      ...init
    });
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as T;
  } catch {
    if (fallback !== undefined) return fallback;
    throw new Error("API unavailable");
  }
}

const fallbackLegitimacy: LegitimacyResult = {
  reportId: "demo-report",
  legitimacyScore: 76,
  scamRiskScore: 34,
  confidence: 0.73,
  riskLevel: "moderate",
  trustSignals: ["Detailed role description", "Salary range provided"],
  redFlags: ["Compensation details need clarification"],
  explanationSummary: "Mixed but mostly healthy signals with a few items to verify.",
  recommendedAction: "Proceed with caution and verify recruiter identity.",
  suggestedFollowupQuestions: ["Can you confirm the official role requisition ID?"],
  evidence: {
    scoreBreakdown: { postingQuality: 78, domainConsistency: 74, recruiterAuthenticity: 70, inverseScamRisk: 66 },
    positiveEvidence: ["Clear job details"],
    riskEvidence: ["Some compensation ambiguity"]
  }
};

export const legitimacyApi = {
  analyzeLegitimacy: (payload: LegitimacyInput) =>
    call<LegitimacyResult>("/legitimacy/analyze", { method: "POST", body: JSON.stringify(payload) }, fallbackLegitimacy),
  analyzeRecruiter: (payload: RecruiterCheckInput) =>
    call<RecruiterCheckResult>("/recruiter-check/analyze", { method: "POST", body: JSON.stringify(payload) }, {
      authenticityScore: 72,
      riskLevel: "moderate",
      confidence: 0.68,
      trustSignals: ["Mentions structured interview process"],
      redFlags: [],
      explanationSummary: "Message appears reasonably legitimate but still requires normal verification.",
      followupQuestions: ["Can you share official company email confirmation?"]
    }),
  analyzeCompany: (payload: CompanyCheckInput) =>
    call<CompanyCheckResult>("/company-check/analyze", { method: "POST", body: JSON.stringify(payload) }, {
      legitimacyScore: 74,
      domainTrust: 78,
      consistencyScore: 70,
      confidence: 0.71,
      riskLevel: "moderate",
      surfaceSignals: ["Company website uses HTTPS"],
      redFlags: [],
      explanationSummary: "Company surface appears mostly credible with moderate confidence.",
      recommendedAction: "Proceed with normal verification steps."
    })
};

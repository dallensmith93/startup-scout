import type { ApplicationFitResult, ApplicationRecord } from "./application-types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function tryFetch<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      ...init
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function call<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
  const base = API_BASE.replace(/\/$/, "");
  const first = await tryFetch<T>(`${base}${path}`, init);
  if (first !== null) return first;

  const altBase = API_BASE.endsWith("/api") ? base.replace(/\/api$/, "") : `${base}/api`;
  const second = await tryFetch<T>(`${altBase}${path}`, init);
  if (second !== null) return second;

  if (fallback !== undefined) return fallback;
  throw new Error("API unavailable");
}

const fallbackApplications: ApplicationRecord[] = [
  {
    id: "app_nimbus_ai",
    startupId: "s1",
    startupName: "Nimbus AI",
    roleTitle: "Founding Product Engineer",
    location: "San Francisco, CA",
    compensationBand: "$165k-$210k + meaningful equity",
    roleSummary: "Build AI workflow product features end-to-end with high customer contact.",
    jobDescription: "Own React + Python product surfaces, ship LLM workflow automation, define evals, and collaborate directly with founders on roadmap.",
    requiredSkills: ["react", "typescript", "python", "llm", "workflow automation", "product sense"],
    niceToHaveSkills: ["founding", "experimentation", "analytics"],
    riskSignals: ["high ownership scope", "fast iteration expectations"],
    status: "saved",
    stage: "application",
    lastTouchAt: "2026-03-06"
  },
  {
    id: "app_aurora_backend",
    startupId: "s2",
    startupName: "Aurora Backend",
    roleTitle: "Senior Backend Engineer",
    location: "New York, NY",
    compensationBand: "$175k-$220k + equity",
    roleSummary: "Build developer tooling APIs and platform infrastructure.",
    jobDescription: "Ship Python services, indexing workflows, and customer-facing reliability improvements for AI coding tools.",
    requiredSkills: ["python", "fastapi", "api design", "developer tools", "search"],
    niceToHaveSkills: ["vector retrieval", "observability"],
    riskSignals: ["ambitious roadmap", "lean team bandwidth"],
    status: "tailoring",
    stage: "application",
    lastTouchAt: "2026-03-03"
  }
];

function fallbackFit(appId: string): ApplicationFitResult {
  return {
    applicationId: appId,
    fitScore: 72,
    fitSummary: {
      label: "Strong",
      score: 72,
      reasoning: ["Resume demonstrates direct overlap with role-critical keywords.", "Delivery evidence supports high-ownership environment."]
    },
    riskSummary: {
      label: "Watch",
      score: 48,
      reasoning: ["Scope is broad for a lean team.", "Risk can be reduced with a metrics-first application narrative."]
    },
    keywordGapReport: {
      matchedKeywords: ["react", "typescript", "python"],
      missingKeywords: ["llm", "workflow automation"],
      overlapScore: 60
    },
    tailoredIntroParagraph: "I am excited to apply because my recent work spans React product surfaces, TypeScript delivery, and Python backend execution in high-velocity teams.",
    tailoredResumeBullets: [
      "Shipped React + TypeScript product flows that improved activation conversion by 18% in one quarter.",
      "Built Python APIs and async job orchestration to support AI-assisted workflows at production reliability.",
      "Partnered directly with product leadership to prioritize and launch roadmap-critical features in weekly cycles."
    ],
    strongestRelevantExperience: "Your strongest relevant experience is end-to-end ownership across frontend and backend AI product delivery.",
    recommendedNextStep: "Tailor two bullets around LLM workflow automation and submit within 24 hours.",
    evidence: { source: "local-fallback" },
    reasoning: ["Deterministic fallback payload used because API was unavailable."]
  };
}

export const applicationsApi = {
  list: () => call<ApplicationRecord[]>("/applications", undefined, fallbackApplications),
  byId: async (id: string) => {
    const fallback = fallbackApplications.find((item) => item.id === id) ?? fallbackApplications[0];
    return call<ApplicationRecord>(`/applications/${id}`, undefined, fallback);
  },
  fitSummary: (id: string, resumeText: string, keySkills: string[]) =>
    call<ApplicationFitResult>(
      `/applications/${id}/fit-summary`,
      { method: "POST", body: JSON.stringify({ resumeText, keySkills }) },
      fallbackFit(id)
    )
};

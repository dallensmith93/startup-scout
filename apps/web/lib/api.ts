import type {
  HiddenSignal,
  OutreachRequest,
  OutreachResponse,
  RankingItem,
  ResumeMatchRequest,
  ResumeMatchResponse,
  StartupRecord
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const demoStartups: StartupRecord[] = [
  {
    id: "s1",
    name: "NovaRelay",
    domain: "novarelay.ai",
    website: "https://novarelay.ai",
    location: "San Francisco, USA",
    description: "Agentic customer ops platform for triage, summarization, and workflow routing.",
    firstSeenAt: "2026-03-07T14:15:00Z",
    tags: ["agents", "llm", "automation", "b2b"],
    openRoles: ["Founding Engineer", "AI Product Engineer"],
    score: 86,
    scoreBreakdown: { aiDepth: 88, hiringSignal: 82, founderStrength: 84, marketFit: 83 },
    whyNow: ["Strong AI product clarity.", "High hiring urgency from founding roles."],
    intelligence: {
      marketCategory: "Vertical AI SaaS",
      fundingStage: "Pre-Seed",
      hiringProbability: 84,
      founderSignals: ["Direct founder hiring signal", "Execution credibility from prior scale"],
      aiFocus: ["agents", "llm", "automation"],
      summary: "High-signal startup with clear AI moat and immediate hiring momentum."
    }
  },
  {
    id: "s2",
    name: "KernelCanvas",
    domain: "kernelcanvas.dev",
    website: "https://kernelcanvas.dev",
    location: "New York, USA",
    description: "AI copilot for debugging and refactoring in large engineering codebases.",
    firstSeenAt: "2026-03-07T09:40:00Z",
    tags: ["copilot", "developer-tools", "ai", "code"],
    openRoles: ["Senior Full Stack Engineer", "Applied ML Engineer"],
    score: 82,
    scoreBreakdown: { aiDepth: 85, hiringSignal: 78, founderStrength: 80, marketFit: 81 },
    whyNow: ["Strong dev tools wedge.", "Clear enterprise pull."],
    intelligence: {
      marketCategory: "Developer Tools",
      fundingStage: "Seed",
      hiringProbability: 79,
      founderSignals: ["Founders have prior top-tier operator experience"],
      aiFocus: ["copilot", "ai"],
      summary: "Developer tooling play with strong distribution potential."
    }
  }
];

function demoRankings(): RankingItem[] {
  return [...demoStartups]
    .sort((a, b) => b.score - a.score)
    .map((row, i) => ({ ...row, rank: i + 1 }));
}

const demoHidden: HiddenSignal[] = [
  {
    id: "hs-s1-founding",
    startupId: "s1",
    startupName: "NovaRelay",
    signal: "Founding-team hiring with high urgency",
    confidence: 0.86,
    whyItMatters: "Founding roles often unlock outsized ownership and accelerated growth."
  }
];

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

async function call<T>(path: string, init?: RequestInit, fallbackValue?: T): Promise<T> {
  const base = API_BASE.replace(/\/$/, "");
  const primary = `${base}${path}`;
  const altBase = API_BASE.endsWith("/api") ? base.replace(/\/api$/, "") : `${base}/api`;
  const secondary = `${altBase}${path}`;

  const first = await tryFetch<T>(primary, init);
  if (first !== null) return first;

  const second = await tryFetch<T>(secondary, init);
  if (second !== null) return second;

  if (fallbackValue !== undefined) return fallbackValue;
  throw new Error("API unavailable");
}

export const api = {
  health: () => call<{ ok: boolean }>("/health", undefined, { ok: true }),
  startups: () => call<StartupRecord[]>("/startups", undefined, demoStartups),
  startupById: async (id: string) => {
    const remote = await call<StartupRecord[] | StartupRecord>(
      `/startups/${id}`,
      undefined,
      demoStartups.find((x) => x.id === id) ?? demoStartups[0]
    );
    if (Array.isArray(remote)) return remote[0] ?? demoStartups[0];
    return remote;
  },
  rankings: () => call<RankingItem[]>("/rankings", undefined, demoRankings()),
  hiddenStartups: () => call<HiddenSignal[]>("/hidden-startups", undefined, demoHidden),
  outreach: async (body: OutreachRequest) => {
    const fallback: OutreachResponse = {
      subject: `${body.candidateName} x ${demoStartups[0].name}`,
      message: `Hi team,\n\nI am excited by your AI direction. ${body.candidatePitch}\n\nBest,\n${body.candidateName}`,
      highlights: ["Auto-generated from local fallback mode", `Tone: ${body.tone}`]
    };
    return call<OutreachResponse>("/outreach/generate", { method: "POST", body: JSON.stringify(body) }, fallback);
  },
  resumeMatch: async (body: ResumeMatchRequest) => {
    const fallback: ResumeMatchResponse = {
      fitScore: 74,
      strengths: ["Strong AI product narrative", "Relevant problem-space experience"],
      skillGaps: ["Add one quantified metric-heavy project example"],
      recommendations: ["Tailor your pitch to the selected startup's GTM and product stage."]
    };
    return call<ResumeMatchResponse>(
      "/resume-match/analyze",
      { method: "POST", body: JSON.stringify(body) },
      fallback
    );
  }
};

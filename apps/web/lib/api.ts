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

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...init
  });
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  health: () => call<{ ok: boolean }>("/health"),
  startups: () => call<StartupRecord[]>("/startups"),
  startupById: (id: string) => call<StartupRecord>(`/startups/${id}`),
  rankings: () => call<RankingItem[]>("/rankings"),
  hiddenStartups: () => call<HiddenSignal[]>("/hidden-startups"),
  outreach: (body: OutreachRequest) =>
    call<OutreachResponse>("/outreach/generate", { method: "POST", body: JSON.stringify(body) }),
  resumeMatch: (body: ResumeMatchRequest) =>
    call<ResumeMatchResponse>("/resume-match/analyze", { method: "POST", body: JSON.stringify(body) })
};

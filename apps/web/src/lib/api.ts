export type StartupStatus = "approved" | "review" | "rejected" | "expired";

export type StartupRecord = {
  id: string;
  name: string;
  website: string;
  domain: string;
  description: string;
  sources: string[];
  firstSeenAt: string;
  freshnessHours: number;
  usaConfidence: number;
  scamScore: number;
  aiRelevanceScore: number;
  aiCategory: string;
  hiringUrgencyScore: number;
  openRoles?: string[];
  applyUrl?: string;
  careersUrl?: string;
  status: StartupStatus;
};

export type StartupsResponse = {
  approved: StartupRecord[];
  review: StartupRecord[];
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export function getStartups() {
  return call<StartupsResponse>("/startups");
}

export function getHealth() {
  return call<{ ok: boolean }>("/health");
}

export function runIngest() {
  return call<{ ok: true; total: number; approved: number; review: number; rejected: number; expired: number }>(
    "/ingest/run",
    { method: "POST" }
  );
}

export function approveReview(id: string) {
  return call<{ ok: true }>(`/review/${id}/approve`, { method: "POST" });
}

export function rejectReview(id: string) {
  return call<{ ok: true }>(`/review/${id}/reject`, { method: "POST" });
}

export function pruneExpired() {
  return call<{ ok: true; prunedCount: number }>("/prune/expired", { method: "POST" });
}

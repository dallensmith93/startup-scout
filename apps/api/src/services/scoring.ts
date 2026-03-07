import type { AiCategory, StartupCandidate, StartupRecord, StartupStatus } from "../types.js";

const AI_KEYWORDS: Array<{ term: string; weight: number; category: AiCategory }> = [
  { term: "agent", weight: 26, category: "agent" },
  { term: "copilot", weight: 24, category: "copilot" },
  { term: "llm", weight: 24, category: "general-ai" },
  { term: "machine learning", weight: 20, category: "ml-system" },
  { term: "ml", weight: 14, category: "ml-system" },
  { term: "automation", weight: 18, category: "automation" },
  { term: "developer workflow", weight: 20, category: "developer-tool" },
  { term: "code", weight: 10, category: "developer-tool" },
  { term: "analysis", weight: 14, category: "search-analysis" },
  { term: "classification", weight: 18, category: "ml-system" },
  { term: "summarization", weight: 18, category: "search-analysis" },
  { term: "recommendation", weight: 16, category: "search-analysis" }
];

const USA_POSITIVE = ["usa", "united states", "san francisco", "new york", "austin", "seattle", "boston", "ca", "ny", "tx", "wa", "ma"];
const USA_NEGATIVE = ["remote worldwide", "eu", "europe", "india", "singapore", "uk", "canada", "australia"];
const SCAM_TERMS = ["guaranteed returns", "risk free", "pump", "casino", "quick rich", "airdrop only"];

export function computeFreshnessHours(firstSeenAt: string, now = new Date()): number {
  const seen = new Date(firstSeenAt);
  if (Number.isNaN(seen.getTime())) return 999;
  return Math.max(0, Number(((now.getTime() - seen.getTime()) / 3600000).toFixed(1)));
}

export function scoreUsaConfidence(text: string): number {
  const lower = text.toLowerCase();
  let score = 0.5;
  for (const term of USA_POSITIVE) {
    if (lower.includes(term)) score += 0.12;
  }
  for (const term of USA_NEGATIVE) {
    if (lower.includes(term)) score -= 0.15;
  }
  return clamp(score, 0, 1);
}

export function scoreScamRisk(text: string): number {
  const lower = text.toLowerCase();
  let score = 12;
  for (const term of SCAM_TERMS) {
    if (lower.includes(term)) score += 20;
  }
  if (lower.includes("pre-seed") || lower.includes("seed")) score -= 4;
  if (lower.includes("founder") || lower.includes("hiring")) score -= 3;
  return clamp(Math.round(score), 0, 100);
}

export function scoreAiRelevance(text: string): { score: number; category: AiCategory } {
  const lower = text.toLowerCase();
  let total = 0;
  const categoryScores = new Map<AiCategory, number>();
  for (const item of AI_KEYWORDS) {
    if (lower.includes(item.term)) {
      total += item.weight;
      categoryScores.set(item.category, (categoryScores.get(item.category) ?? 0) + item.weight);
    }
  }
  const score = clamp(total, 0, 100);
  let category: AiCategory = "general-ai";
  let best = -1;
  for (const [k, v] of categoryScores.entries()) {
    if (v > best) {
      best = v;
      category = k;
    }
  }
  return { score, category };
}

export function deriveStatus(input: {
  freshnessHours: number;
  usaConfidence: number;
  scamScore: number;
  aiRelevanceScore: number;
  hiringUrgencyScore: number;
}): StartupStatus {
  if (input.freshnessHours > 48) return "expired";
  if (input.usaConfidence < 0.7) return "rejected";
  if (input.scamScore > 44) return "rejected";
  if (input.aiRelevanceScore < 45) return "rejected";
  if (input.hiringUrgencyScore < 45) return "rejected";
  if (input.aiRelevanceScore < 65 || input.hiringUrgencyScore < 65) return "review";
  return "approved";
}

export function pickApplyLink(input: { applyUrl?: string; careersUrl?: string; website: string }): string {
  return input.applyUrl || input.careersUrl || input.website;
}

export function normalizeCandidate(candidate: StartupCandidate, now = new Date()): StartupRecord {
  const description = (candidate.description ?? "").trim();
  const text = `${description} ${(candidate.tags ?? []).join(" ")} ${candidate.text ?? ""}`.trim();
  const firstSeenAt = candidate.firstSeenAt ?? now.toISOString();
  const freshnessHours = computeFreshnessHours(firstSeenAt, now);
  const website = candidate.website ?? "";
  const domain = candidate.domain ?? extractDomain(website, candidate.name);

  const usaConfidence = scoreUsaConfidence(text);
  const scamScore = scoreScamRisk(text);
  const ai = scoreAiRelevance(text);

  const startupBase = {
    id: crypto.randomUUID(),
    name: candidate.name,
    website,
    domain,
    description,
    sources: [candidate.source],
    firstSeenAt,
    freshnessHours,
    usaConfidence,
    scamScore,
    aiRelevanceScore: ai.score,
    aiCategory: ai.category,
    hiringUrgencyScore: 0,
    openRoles: candidate.openRoles,
    applyUrl: candidate.applyUrl,
    careersUrl: candidate.careersUrl,
    status: "review" as StartupStatus
  };

  return startupBase;
}

function extractDomain(website: string, name: string): string {
  if (!website) return name.toLowerCase().replace(/\s+/g, "-");
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return website.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] || name;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

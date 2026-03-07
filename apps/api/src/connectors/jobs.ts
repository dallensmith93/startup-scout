import type { StartupCandidate } from "../types.js";

export function extractApplyUrl(website: string, text?: string): string | undefined {
  const blob = `${website} ${text ?? ""}`.toLowerCase();
  if (blob.includes("greenhouse")) return `${website.replace(/\/$/, "")}/jobs`;
  if (blob.includes("lever")) return `${website.replace(/\/$/, "")}/careers`;
  if (blob.includes("apply")) return `${website.replace(/\/$/, "")}/apply`;
  return undefined;
}

export function extractCareersUrl(website: string): string | undefined {
  if (!website) return undefined;
  return `${website.replace(/\/$/, "")}/careers`;
}

export async function fetchJobCandidates(): Promise<StartupCandidate[]> {
  const now = Date.now();
  return [
    {
      name: "ForgePilot",
      website: "https://forgepilot.ai",
      domain: "forgepilot.ai",
      description: "Founding engineer role open now. Build LLM copilots with founders in San Francisco.",
      source: "jobs",
      firstSeenAt: new Date(now - 6 * 3600000).toISOString(),
      openRoles: ["Founding Engineer", "ML Engineer"],
      text: "urgent hire early team"
    },
    {
      name: "SignalScribe",
      website: "https://signalscribe.com",
      domain: "signalscribe.com",
      description: "First engineer hiring for an agentic workflow automation startup in New York.",
      source: "jobs",
      firstSeenAt: new Date(now - 20 * 3600000).toISOString(),
      openRoles: ["First Engineer"],
      text: "immediate hire"
    }
  ];
}

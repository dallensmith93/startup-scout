import { extractCareersUrl } from "./jobs.js";
import type { StartupCandidate } from "../types.js";

export async function fetchYcCandidates(): Promise<StartupCandidate[]> {
  const now = Date.now();
  return [
    {
      name: "DataBard",
      website: "https://databard.io",
      domain: "databard.io",
      description:
        "ML-backed analytics assistant for enterprise search and classification. Seattle, USA. Hiring founding engineer.",
      source: "yc",
      firstSeenAt: new Date(now - 12 * 3600000).toISOString(),
      tags: ["ML", "search", "classification"],
      text: "agentic analysis",
      careersUrl: extractCareersUrl("https://databard.io")
    },
    {
      name: "OldWave",
      website: "https://oldwave.ai",
      domain: "oldwave.ai",
      description: "AI infrastructure startup in Boston, USA. Was launched earlier this week.",
      source: "yc",
      firstSeenAt: new Date(now - 80 * 3600000).toISOString(),
      tags: ["AI"],
      text: "hiring now"
    }
  ];
}

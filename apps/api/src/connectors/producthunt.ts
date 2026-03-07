import { extractApplyUrl, extractCareersUrl } from "./jobs.js";
import type { StartupCandidate } from "../types.js";

export async function fetchProductHuntCandidates(): Promise<StartupCandidate[]> {
  const now = Date.now();
  return [
    {
      name: "ForgePilot",
      website: "https://forgepilot.ai",
      domain: "forgepilot.ai",
      description:
        "AI coding copilot for internal developer workflows. San Francisco, USA. Pre-seed and urgently hiring founding engineer.",
      source: "producthunt",
      firstSeenAt: new Date(now - 5 * 3600000).toISOString(),
      tags: ["AI", "copilot", "developer tools"],
      text: "LLM-backed coding assistant for automation",
      applyUrl: extractApplyUrl("https://forgepilot.ai", "apply founding engineer"),
      careersUrl: extractCareersUrl("https://forgepilot.ai")
    },
    {
      name: "PromptBloom",
      website: "https://promptbloom.com",
      domain: "promptbloom.com",
      description:
        "LLM summarization and automation for product teams. Austin, USA. Early team hiring in pre-seed stage.",
      source: "producthunt",
      firstSeenAt: new Date(now - 30 * 3600000).toISOString(),
      tags: ["summarization", "AI"],
      text: "hiring immediate hire role being finalized"
    }
  ];
}

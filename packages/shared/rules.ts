import type { StartupRecord, StartupStatus } from "./types";

export function pickApplyLink(record: Pick<StartupRecord, "applyUrl" | "careersUrl" | "website">): string {
  return record.applyUrl || record.careersUrl || record.website;
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

  const borderlineAi = input.aiRelevanceScore < 65;
  const borderlineHiring = input.hiringUrgencyScore < 65;
  if (borderlineAi || borderlineHiring) return "review";

  return "approved";
}

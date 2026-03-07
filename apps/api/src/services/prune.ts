import type { StartupRecord } from "../types.js";

export function removeExpired(records: StartupRecord[]): { kept: StartupRecord[]; prunedCount: number } {
  const kept = records.filter((r) => r.status !== "expired");
  return { kept, prunedCount: records.length - kept.length };
}

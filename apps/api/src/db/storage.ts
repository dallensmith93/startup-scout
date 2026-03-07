import type { StartupRecord, StartupStatus } from "../types.js";

let records: StartupRecord[] = [];

export function resetStorage(): void {
  records = [];
}

export function getAllRecords(): StartupRecord[] {
  return [...records];
}

export function saveBatch(next: StartupRecord[]): void {
  const index = new Map<string, StartupRecord>();
  for (const current of records) {
    index.set(keyFor(current), current);
  }

  for (const incoming of next) {
    const key = keyFor(incoming);
    const existing = index.get(key);
    if (!existing) {
      index.set(key, incoming);
      continue;
    }

    const mergedSources = Array.from(new Set([...existing.sources, ...incoming.sources]));
    const mergedRoles = Array.from(new Set([...(existing.openRoles ?? []), ...(incoming.openRoles ?? [])]));
    index.set(key, {
      ...existing,
      ...incoming,
      sources: mergedSources,
      openRoles: mergedRoles.length ? mergedRoles : undefined,
      firstSeenAt: existing.firstSeenAt < incoming.firstSeenAt ? existing.firstSeenAt : incoming.firstSeenAt,
      freshnessHours: Math.min(existing.freshnessHours, incoming.freshnessHours)
    });
  }

  records = Array.from(index.values());
}

export function listByStatus(): { approved: StartupRecord[]; review: StartupRecord[] } {
  return {
    approved: records.filter((r) => r.status === "approved"),
    review: records.filter((r) => r.status === "review")
  };
}

export function updateStatus(id: string, nextStatus: Extract<StartupStatus, "approved" | "rejected">): StartupRecord | undefined {
  const item = records.find((r) => r.id === id && r.status === "review");
  if (!item) return undefined;
  item.status = nextStatus;
  return item;
}

export function pruneExpiredInStorage(): number {
  const before = records.length;
  records = records.filter((r) => r.status !== "expired");
  return before - records.length;
}

function keyFor(record: Pick<StartupRecord, "domain" | "name">): string {
  return `${record.domain.toLowerCase()}::${record.name.toLowerCase().replace(/\s+/g, "-")}`;
}

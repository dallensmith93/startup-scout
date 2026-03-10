import { trackerApi } from "./tracker-api-client";

export type TrackerStatus = "saved" | "applied" | "interview" | "offer" | "rejected";

export type TrackerItem = {
  id: string;
  company: string;
  role: string;
  status: TrackerStatus;
  location: string;
  dueDate: string;
  nextAction: string;
  notes: string;
  updatedAt: string;
};

function stageToStatus(stage: string): TrackerStatus {
  const value = stage.toLowerCase();
  if (value.includes("screen") || value.includes("interview")) return "interview";
  if (value.includes("offer")) return "offer";
  if (value.includes("reject") || value.includes("close")) return "rejected";
  if (value.includes("apply") || value.includes("follow")) return "applied";
  return "saved";
}

export async function getTrackerItems(): Promise<TrackerItem[]> {
  const data = await trackerApi.list();
  return data.items.map((item, idx) => ({
    id: item.applicationId,
    company: item.startupName,
    role: item.roleTitle,
    status: stageToStatus(item.stage),
    location: "Remote",
    dueDate: item.updatedAt,
    nextAction: item.nextAction,
    notes: item.note,
    updatedAt: item.updatedAt
  })).sort((a, b) => a.company.localeCompare(b.company) || a.role.localeCompare(b.role));
}

export async function persistTrackerItems(items: TrackerItem[]): Promise<void> {
  for (const item of items.slice(0, 8)) {
    const stage = item.status === "saved" ? "application" : item.status;
    await trackerApi.update(item.id, stage, item.notes || item.nextAction);
  }
}

export { trackerApi };

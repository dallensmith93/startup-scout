import type { FollowupReminder, TrackerResponse } from "./application-types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const STORAGE_KEY = "phase4-tracker-overrides";

type Override = {
  stage: string;
  note: string;
};

function readOverrides(): Record<string, Override> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Override>) : {};
  } catch {
    return {};
  }
}

function writeOverrides(next: Record<string, Override>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

async function fetchTrackerRemote(): Promise<TrackerResponse | null> {
  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, "")}/tracker`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as TrackerResponse;
  } catch {
    return null;
  }
}

const fallback: TrackerResponse = {
  total: 3,
  items: [
    {
      applicationId: "app_nimbus_ai",
      startupName: "Nimbus AI",
      roleTitle: "Founding Product Engineer",
      status: "saved",
      stage: "application",
      note: "",
      updatedAt: "2026-03-06",
      nextAction: "Tailor resume bullets to role language"
    },
    {
      applicationId: "app_delta_platform",
      startupName: "Delta Platform",
      roleTitle: "Platform Engineer",
      status: "applied",
      stage: "follow-up",
      note: "Application sent via founder referral.",
      updatedAt: "2026-02-27",
      nextAction: "Send follow-up with one quantified achievement"
    },
    {
      applicationId: "app_vertex_data",
      startupName: "Vertex Data",
      roleTitle: "Data Systems Engineer",
      status: "interview",
      stage: "screening",
      note: "",
      updatedAt: "2026-02-26",
      nextAction: "Prepare targeted project narratives"
    }
  ]
};

export const trackerApi = {
  async list(): Promise<TrackerResponse> {
    const remote = await fetchTrackerRemote();
    const base = remote ?? fallback;
    const overrides = readOverrides();
    const items = base.items.map((item) => {
      const override = overrides[item.applicationId];
      return override ? { ...item, stage: override.stage, note: override.note } : item;
    });
    return { total: items.length, items };
  },

  async update(applicationId: string, stage: string, note: string) {
    const payload = { applicationId, stage, note };
    try {
      const res = await fetch(`${API_BASE.replace(/\/$/, "")}/tracker/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) return (await res.json()) as { item: TrackerResponse["items"][number] };
    } catch {
      // local fallback below
    }

    const current = readOverrides();
    current[applicationId] = { stage, note };
    writeOverrides(current);
    const full = await this.list();
    const item = full.items.find((x) => x.applicationId === applicationId);
    if (!item) throw new Error("Application not found");
    return { item };
  },

  async followups(): Promise<{ items: FollowupReminder[] }> {
    try {
      const res = await fetch(`${API_BASE.replace(/\/$/, "")}/tracker/followups`, { cache: "no-store" });
      if (res.ok) return (await res.json()) as { items: FollowupReminder[] };
    } catch {
      // fallback below
    }

    return {
      items: [
        {
          applicationId: "app_delta_platform",
          startupName: "Delta Platform",
          roleTitle: "Platform Engineer",
          urgency: "medium",
          reason: "No update since 2026-02-27; follow-up window is open.",
          suggestedMessage: "Quick follow-up on my Platform Engineer application. Happy to share additional project details if useful."
        }
      ]
    };
  }
};

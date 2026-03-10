export type PriorityItem = {
  applicationId: string;
  startupName: string;
  roleTitle: string;
  priorityScore: number;
  fitScore: number;
  riskScore: number;
  decayScore: number;
  urgencyWindow: string;
  whyNow: string;
  whyNowSignals: string[];
  nextBestAction: string;
};

export type PrioritiesData = {
  queue: PriorityItem[];
  reason: string;
};

type PriorityItemWire = Omit<PriorityItem, "decayScore" | "urgencyWindow" | "whyNowSignals" | "nextBestAction"> &
  Partial<Pick<PriorityItem, "decayScore" | "urgencyWindow" | "whyNowSignals" | "nextBestAction">>;

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function normalizeItem(item: PriorityItemWire): PriorityItem {
  return {
    ...item,
    decayScore: item.decayScore ?? Math.max(10, 100 - item.priorityScore),
    urgencyWindow: item.urgencyWindow ?? "72h",
    whyNowSignals: item.whyNowSignals ?? ["Strong fit", "Live opening", "Competitive funnel"],
    nextBestAction: item.nextBestAction ?? "Send a concise, quantified follow-up."
  };
}

const fallback: PrioritiesData = {
  queue: [
    {
      applicationId: "app_nimbus_ai",
      startupName: "Nimbus AI",
      roleTitle: "Founding Product Engineer",
      priorityScore: 88,
      fitScore: 82,
      riskScore: 44,
      decayScore: 68,
      urgencyWindow: "48h",
      whyNow: "Highest score with near-term application deadline and strong role fit.",
      whyNowSignals: ["Founder-led review this week", "Your shipping experience maps tightly", "No blocker risks in current profile"],
      nextBestAction: "Finalize tailored narrative and submit tonight."
    },
    {
      applicationId: "app_vertex_data",
      startupName: "Vertex Data",
      roleTitle: "Data Systems Engineer",
      priorityScore: 82,
      fitScore: 79,
      riskScore: 47,
      decayScore: 55,
      urgencyWindow: "72h",
      whyNow: "Interview-stage momentum and favorable technical alignment.",
      whyNowSignals: ["Interview context already warm", "Strong systems depth match"],
      nextBestAction: "Prep two metric-backed project stories for next call."
    }
  ],
  reason: "Fallback priority queue."
};

export async function getPriorityData(): Promise<PrioritiesData> {
  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, "")}/priorities`, { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { queue?: PriorityItemWire[]; reason?: string };
      if (data.queue && Array.isArray(data.queue)) {
        return {
          queue: data.queue.map(normalizeItem),
          reason: data.reason ?? fallback.reason
        };
      }
    }
  } catch {
    // fallback below
  }

  return fallback;
}

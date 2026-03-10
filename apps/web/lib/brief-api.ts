export type BriefPriority = "critical" | "high" | "medium";
export type BriefBlockType = "follow-up" | "deep-work" | "quick-win" | "prep";

export type BriefFocusBlock = {
  id: string;
  title: string;
  type: BriefBlockType;
  priority: BriefPriority;
  minutes: number;
  action: string;
  reason: string;
};

export type BriefSignal = {
  id: string;
  label: string;
  value: string;
  trend: "up" | "flat" | "down";
  reason: string;
};

export type DailyBriefData = {
  date: string;
  title: string;
  summary: string;
  guidance: string;
  focusBlocks: BriefFocusBlock[];
  signals: BriefSignal[];
  risks: string[];
  reason: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const fallback: DailyBriefData = {
  date: "2026-03-10",
  title: "Protect response velocity before noon",
  summary: "Your strongest roles are live, but follow-up timing will decide conversion this week.",
  guidance: "Complete two high-quality follow-ups first, then ship one tailored submission with proof of impact.",
  focusBlocks: [
    {
      id: "brief-block-1",
      title: "OrbitGrade follow-up with product metric proof",
      type: "follow-up",
      priority: "critical",
      minutes: 20,
      action: "Send a concise follow-up with one quantified experiment result and a clear CTA.",
      reason: "Interview loop is active and response windows for founder-led teams close quickly."
    },
    {
      id: "brief-block-2",
      title: "Submit Nimbus AI tailored application",
      type: "deep-work",
      priority: "high",
      minutes: 40,
      action: "Attach architecture note focused on shipping speed and reliability tradeoffs.",
      reason: "Fit signal is high and role is likely first-come screened."
    },
    {
      id: "brief-block-3",
      title: "Interview prep refresh for Vertex Data",
      type: "prep",
      priority: "medium",
      minutes: 25,
      action: "Rehearse two system-design stories tied to measurable outcomes.",
      reason: "Interview-stage roles convert better with role-specific narratives."
    }
  ],
  signals: [
    { id: "signal-1", label: "Response rate", value: "31%", trend: "up", reason: "Recent follow-ups improved thread reactivation." },
    { id: "signal-2", label: "Applications sent this week", value: "3 / 5", trend: "flat", reason: "Pipeline quality is strong but volume is behind target." },
    { id: "signal-3", label: "Aging active leads", value: "4", trend: "down", reason: "Unanswered active leads are starting to decay." }
  ],
  risks: [
    "Two high-fit opportunities have no same-day action scheduled.",
    "Follow-up cadence is below weekly target.",
    "Prep time is being displaced by additional sourcing."
  ],
  reason: "Fallback daily brief for local development continuity."
};

export async function getDailyBriefData(): Promise<DailyBriefData> {
  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, "")}/daily-brief`, { cache: "no-store" });
    if (res.ok) {
      const incoming = (await res.json()) as Partial<DailyBriefData>;
      return {
        ...fallback,
        ...incoming,
        focusBlocks: incoming.focusBlocks ?? fallback.focusBlocks,
        signals: incoming.signals ?? fallback.signals,
        risks: incoming.risks ?? fallback.risks
      };
    }
  } catch {
    // fallback below
  }

  return fallback;
}

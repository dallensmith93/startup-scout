export type NudgePriority = "high" | "medium" | "low";
export type NudgeKind = "timing" | "quality" | "risk" | "momentum";
export type NudgeState = "new" | "snoozed" | "done";

export type NudgeItem = {
  id: string;
  title: string;
  kind: NudgeKind;
  priority: NudgePriority;
  state: NudgeState;
  impact: string;
  window: string;
  actionLabel: string;
  actionPath: string;
  reason: string;
};

export type NudgeData = {
  summary: string;
  reason: string;
  items: NudgeItem[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const fallback: NudgeData = {
  summary: "Nudges prioritize actions that are most likely to move active opportunities forward today.",
  reason: "Fallback nudge feed for local development continuity.",
  items: [
    {
      id: "nudge-1",
      title: "Send OrbitGrade follow-up before 11:30 AM",
      kind: "timing",
      priority: "high",
      state: "new",
      impact: "Preserves an interview-stage conversation that is at risk of stalling.",
      window: "Best window: next 2 hours",
      actionLabel: "Open tracker",
      actionPath: "/tracker",
      reason: "No outbound touchpoint in 5 days for an active process."
    },
    {
      id: "nudge-2",
      title: "Upgrade Nimbus AI application intro",
      kind: "quality",
      priority: "medium",
      state: "new",
      impact: "Raises recruiter confidence with explicit startup-relevant outcomes.",
      window: "Today",
      actionLabel: "Open tailor",
      actionPath: "/tailor",
      reason: "Role fit is high but proof of impact in intro is still generic."
    },
    {
      id: "nudge-3",
      title: "Trim low-conversion sourcing block",
      kind: "momentum",
      priority: "low",
      state: "snoozed",
      impact: "Recovers 30 to 45 minutes for follow-up or prep work.",
      window: "This afternoon",
      actionLabel: "Open planner",
      actionPath: "/planner",
      reason: "Current schedule over-allocates research versus conversion tasks."
    }
  ]
};

export async function getNudgeData(): Promise<NudgeData> {
  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, "")}/nudges`, { cache: "no-store" });
    if (res.ok) {
      const incoming = (await res.json()) as Partial<NudgeData>;
      return {
        ...fallback,
        ...incoming,
        items: incoming.items ?? fallback.items
      };
    }
  } catch {
    // fallback below
  }

  return fallback;
}

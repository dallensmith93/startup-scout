export type EffortAllocationItem = { category: string; hours: number; reason: string };
export type PlannedAction = { title: string; owner: string; day: string; reason: string };
export type WeeklyPlanData = {
  weekOf: string;
  focusTheme: string;
  effortAllocation: EffortAllocationItem[];
  suggestedActions: PlannedAction[];
  summary: string;
};

export type WeeklyReportData = {
  weekOf: string;
  wins: string[];
  risks: string[];
  nextSteps: string[];
  confidence: number;
  confidenceReason: string;
  reason: string;
};

type WeeklyReportApiShape = {
  weekOf?: string;
  wins?: string[];
  risks?: string[];
  bottlenecks?: string[];
  nextSteps?: string[];
  nextWeekPlan?: string[];
  confidence?: number;
  confidenceReason?: string;
  reason?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getPlannerData(): Promise<WeeklyPlanData> {
  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, "")}/planner/weekly`, { cache: "no-store" });
    if (res.ok) return (await res.json()) as WeeklyPlanData;
  } catch {
    // fallback below
  }

  return {
    weekOf: "2026-03-10",
    focusTheme: "Quality-adjusted pipeline acceleration",
    effortAllocation: [
      { category: "Outreach", hours: 8, reason: "Increase top-of-funnel signal flow." },
      { category: "Follow-ups", hours: 7, reason: "Prevent warm opportunities from stalling." },
      { category: "Tailoring", hours: 7, reason: "Improve response conversion quality." },
      { category: "Interview Prep", hours: 4, reason: "Convert active interview opportunities." }
    ],
    suggestedActions: [
      { title: "Submit two high-priority applications", owner: "You", day: "Tuesday", reason: "Pipeline growth target." },
      { title: "Run follow-up block", owner: "You", day: "Wednesday", reason: "Reduce follow-up backlog." }
    ],
    summary: "Fallback weekly plan tuned for deterministic demo flow."
  };
}

function normalizeWeeklyReportData(payload: WeeklyReportApiShape | null | undefined): WeeklyReportData {
  return {
    weekOf: payload?.weekOf ?? "2026-03-10",
    wins: payload?.wins ?? ["One interview-stage opportunity is active."],
    risks: payload?.risks ?? payload?.bottlenecks ?? ["Follow-up velocity is below target."],
    nextSteps: payload?.nextSteps ?? payload?.nextWeekPlan ?? ["Prioritize top opportunities by score and due date."],
    confidence: payload?.confidence ?? 68,
    confidenceReason: payload?.confidenceReason ?? "Confidence reflects momentum, bottlenecks, and execution consistency.",
    reason: payload?.reason ?? "Fallback weekly report."
  };
}

export async function getWeeklyReportData(): Promise<WeeklyReportData> {
  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, "")}/planner/weekly-report`, { cache: "no-store" });
    if (res.ok) {
      const payload = (await res.json()) as WeeklyReportApiShape;
      return normalizeWeeklyReportData(payload);
    }
  } catch {
    // fallback below
  }

  return normalizeWeeklyReportData(null);
}

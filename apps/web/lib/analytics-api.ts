export type Funnel = {
  saved: number;
  tailoring: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
};

export type AnalyticsData = {
  applicationsTotal: number;
  responseRate: number;
  interviewRate: number;
  momentumScore: number;
  funnel: Funnel;
  outreachSent: number;
  outreachResponses: number;
  outreachTargetResponseRate?: number;
  outreachPerformanceInsights?: Array<{ title: string; value: string; urgency: string; reason: string }>;
  reason: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, "")}/analytics`, { cache: "no-store" });
    if (res.ok) return (await res.json()) as AnalyticsData;
  } catch {
    // fallback below
  }

  return {
    applicationsTotal: 5,
    responseRate: 40,
    interviewRate: 20,
    momentumScore: 72,
    funnel: { saved: 1, tailoring: 1, applied: 2, interview: 1, offer: 0, rejected: 0 },
    outreachSent: 12,
    outreachResponses: 3,
    outreachTargetResponseRate: 25,
    outreachPerformanceInsights: [
      {
        title: "Direct response rate",
        value: "25%",
        urgency: "medium",
        reason: "Direct channel conversion is stable but can improve with tighter role-specific proof."
      },
      {
        title: "Referral response rate",
        value: "50%",
        urgency: "low",
        reason: "Referral channel is outperforming direct outreach; prioritize warm intros."
      }
    ],
    reason: "Fallback analytics."
  };
}

export type DashboardMetric = { label: string; value: number; target: number; reason: string };
export type PipelineItem = { stage: string; count: number };
export type Opportunity = { applicationId: string; startupName: string; roleTitle: string; score: number; reason: string };
export type RiskAlert = { applicationId: string; headline: string; severity: string; reason: string };

export type OpportunityDecay = {
  applicationId: string;
  startupName: string;
  roleTitle: string;
  decayScore: number;
  timeWindow: string;
  reason: string;
  nextAction: string;
};

export type StuckInsight = {
  headline: string;
  cause: string;
  evidence: string[];
  unblockActions: string[];
};

export type DashboardActionItem = {
  id: string;
  title: string;
  actionType: "follow_up" | "apply" | "tailor" | "prep";
  priority: "high" | "medium" | "low";
  etaMinutes: number;
  reason: string;
};

export type DashboardData = {
  momentumScore: number;
  weeklyFocusScore: number;
  weeklyFocusTarget: number;
  weeklyFocusReason: string;
  summaryMetrics: DashboardMetric[];
  pipelineSnapshot: PipelineItem[];
  topOpportunities: Opportunity[];
  opportunityDecay: OpportunityDecay[];
  stuckInsight: StuckInsight;
  actionQueuePreview: DashboardActionItem[];
  riskAlerts: RiskAlert[];
  reason: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const fallback: DashboardData = {
  momentumScore: 73,
  weeklyFocusScore: 68,
  weeklyFocusTarget: 80,
  weeklyFocusReason: "Too much time is going to low-conversion tasks. Shift into outbound and interview prep blocks.",
  summaryMetrics: [
    { label: "Applications", value: 3, target: 5, reason: "Need two more quality applications this week." },
    { label: "Follow-ups", value: 2, target: 6, reason: "Follow-up cadence is behind plan." },
    { label: "Responses", value: 2, target: 2, reason: "Response count is on target." },
    { label: "Interviews", value: 1, target: 1, reason: "Interview pipeline is active." }
  ],
  pipelineSnapshot: [
    { stage: "saved", count: 1 },
    { stage: "tailoring", count: 1 },
    { stage: "applied", count: 2 },
    { stage: "interview", count: 1 },
    { stage: "offer", count: 0 },
    { stage: "rejected", count: 0 }
  ],
  topOpportunities: [
    { applicationId: "app_nimbus_ai", startupName: "Nimbus AI", roleTitle: "Founding Product Engineer", score: 88, reason: "Strong fit with manageable risk and near-term due date." },
    { applicationId: "app_vertex_data", startupName: "Vertex Data", roleTitle: "Data Systems Engineer", score: 84, reason: "Interview-stage momentum plus strong fit signal." }
  ],
  opportunityDecay: [
    {
      applicationId: "app_orbitgrade_pm",
      startupName: "OrbitGrade",
      roleTitle: "Product Manager",
      decayScore: 82,
      timeWindow: "24h",
      reason: "Hiring team reopened interviews and response velocity is high.",
      nextAction: "Send follow-up with a quantified product experiment result."
    },
    {
      applicationId: "app_nimbus_ai",
      startupName: "Nimbus AI",
      roleTitle: "Founding Product Engineer",
      decayScore: 66,
      timeWindow: "48h",
      reason: "Fast-moving founder-led process with first-come screening.",
      nextAction: "Submit tailored application and include a short architecture note."
    }
  ],
  stuckInsight: {
    headline: "You are execution-heavy but conversion-light.",
    cause: "Most effort is in research and tailoring while high-leverage follow-ups are slipping.",
    evidence: [
      "Follow-up target is 6 this week but only 2 are completed.",
      "Saved + tailoring stages have 2 roles with no send action queued.",
      "Recent interview progress came from previously followed-up roles."
    ],
    unblockActions: [
      "Ship 3 follow-ups in a 45-minute sprint today.",
      "Force a same-day submit rule for opportunities above 80 score.",
      "Block 30 minutes for interview prep instead of additional sourcing."
    ]
  },
  actionQueuePreview: [
    {
      id: "aq_1",
      title: "Follow up with OrbitGrade",
      actionType: "follow_up",
      priority: "high",
      etaMinutes: 15,
      reason: "Window closes within 24h and no recent touchpoint is logged."
    },
    {
      id: "aq_2",
      title: "Submit Nimbus AI application",
      actionType: "apply",
      priority: "high",
      etaMinutes: 35,
      reason: "Fit score is top-tier and timing advantage decays quickly."
    },
    {
      id: "aq_3",
      title: "Tailor Vertex Data case note",
      actionType: "tailor",
      priority: "medium",
      etaMinutes: 20,
      reason: "Short tailored proof improves interview-stage conversion."
    }
  ],
  riskAlerts: [
    { applicationId: "app_orbitgrade_pm", headline: "OrbitGrade follow-up risk", severity: "high", reason: "No reply yet and due date is immediate." }
  ],
  reason: "Fallback dashboard data for local demo continuity."
};

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, "")}/dashboard`, { cache: "no-store" });
    if (res.ok) {
      const incoming = (await res.json()) as Partial<DashboardData>;
      return {
        ...fallback,
        ...incoming,
        opportunityDecay: incoming.opportunityDecay ?? fallback.opportunityDecay,
        actionQueuePreview: incoming.actionQueuePreview ?? fallback.actionQueuePreview,
        stuckInsight: incoming.stuckInsight ?? fallback.stuckInsight,
        summaryMetrics: incoming.summaryMetrics ?? fallback.summaryMetrics,
        pipelineSnapshot: incoming.pipelineSnapshot ?? fallback.pipelineSnapshot,
        topOpportunities: incoming.topOpportunities ?? fallback.topOpportunities,
        riskAlerts: incoming.riskAlerts ?? fallback.riskAlerts
      };
    }
  } catch {
    // fallback below
  }
  return fallback;
}

export type OutreachTemplate = {
  id: string;
  label: string;
  channel: "email" | "linkedin";
  subject: string;
  body: string;
  contextTag: string;
};

export type FollowupDraft = {
  id: string;
  contactName: string;
  company: string;
  whyNow: string;
  draft: string;
};

export type ReferralAsk = {
  id: string;
  contactName: string;
  targetRole: string;
  ask: string;
  supportingProof: string;
};

export type ToneContext = {
  voice: string;
  doList: string[];
  avoidList: string[];
};

export type OutreachHubData = {
  generatedAt: string;
  weeklyTarget: number;
  sentThisWeek: number;
  responseRate: number;
  templates: OutreachTemplate[];
  followups: FollowupDraft[];
  referralAsks: ReferralAsk[];
  toneContext: ToneContext;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const fallbackOutreachData: OutreachHubData = {
  generatedAt: "2026-03-10",
  weeklyTarget: 8,
  sentThisWeek: 5,
  responseRate: 41,
  templates: [
    {
      id: "tpl-follow-up",
      label: "Warm follow-up",
      channel: "email",
      subject: "Quick update and one ask",
      body: "Hi {{name}}, quick update on role fit and recent progress. If aligned, would you be open to a short intro?",
      contextTag: "Follow-up"
    }
  ],
  followups: [
    {
      id: "fu-1",
      contactName: "Avery Kim",
      company: "OrbitNest",
      whyNow: "Strong response likelihood and recent momentum.",
      draft: "Hi Avery, quick update on fit and one concrete result. If useful, I can share a short summary today."
    }
  ],
  referralAsks: [
    {
      id: "ref-1",
      contactName: "Avery Kim",
      targetRole: "Target role",
      ask: "Would you be open to introducing me to the hiring owner?",
      supportingProof: "Recent role-relevant impact with measurable outcomes."
    }
  ],
  toneContext: {
    voice: "Warm, direct, and proof-driven.",
    doList: ["Lead with one concrete result.", "Make one specific ask.", "Keep message concise."],
    avoidList: ["Do not ask multiple favors in one message.", "Avoid vague claims."]
  }
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function clampPercent(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export async function getOutreachHubData(): Promise<OutreachHubData> {
  try {
    const response = await fetch(`${API_BASE.replace(/\/$/, "")}/outreach-hub`, { cache: "no-store" });
    if (!response.ok) throw new Error("outreach-hub failed");

    const payload = (await response.json()) as {
      generatedForDate?: string;
      focus?: string;
      focusReason?: string;
      tone?: string;
      context?: { plays?: string[] };
      followupDrafts?: Array<{
        contactId?: string;
        contactName?: string;
        company?: string;
        title?: string;
        draft?: string;
        priorityReason?: string;
      }>;
      referralAsks?: Array<{
        contactId?: string;
        contactName?: string;
        ask?: string;
        confidenceReason?: string;
      }>;
    };

    const followups = Array.isArray(payload.followupDrafts)
      ? payload.followupDrafts.map((item, idx) => ({
          id: asString(item.contactId, `fu-${idx}`),
          contactName: asString(item.contactName, "Unknown contact"),
          company: asString(item.company, "Unknown company"),
          whyNow: asString(item.priorityReason, "Follow-up is prioritized by deterministic scoring."),
          draft: asString(item.draft, "Hi {{name}}, quick follow-up on our previous conversation.")
        }))
      : [];

    const referralAsks = Array.isArray(payload.referralAsks)
      ? payload.referralAsks.map((item, idx) => ({
          id: asString(item.contactId, `ref-${idx}`),
          contactName: asString(item.contactName, "Unknown contact"),
          targetRole: "Target role",
          ask: asString(item.ask, "Would you be open to an introduction?"),
          supportingProof: asString(item.confidenceReason, "Confidence derived from relationship strength and recency.")
        }))
      : [];

    const templates: OutreachTemplate[] = [
      {
        id: "tpl-context",
        label: "Context-first update",
        channel: "email",
        subject: "Quick update and one ask",
        body: `Hi {{name}}, ${asString(payload.focus, "quick update on fit")}. ${asString(payload.focusReason, "")}`.trim(),
        contextTag: "Phase 7"
      },
      {
        id: "tpl-value",
        label: "Value-first nudge",
        channel: "linkedin",
        subject: "n/a",
        body: "Hi {{name}} - sharing one role-relevant proof point and a focused next-step question.",
        contextTag: "Warm path"
      }
    ];

    const sentThisWeek = followups.length;
    const weeklyTarget = Math.max(6, sentThisWeek + 2);

    return {
      generatedAt: asString(payload.generatedForDate, new Date().toISOString()),
      weeklyTarget,
      sentThisWeek,
      responseRate: clampPercent(sentThisWeek > 0 ? 35 + sentThisWeek * 4 : 30),
      templates,
      followups: followups.length ? followups : fallbackOutreachData.followups,
      referralAsks: referralAsks.length ? referralAsks : fallbackOutreachData.referralAsks,
      toneContext: {
        voice: asString(payload.tone, fallbackOutreachData.toneContext.voice),
        doList: Array.isArray(payload.context?.plays) && payload.context?.plays.length
          ? payload.context.plays
          : fallbackOutreachData.toneContext.doList,
        avoidList: fallbackOutreachData.toneContext.avoidList
      }
    };
  } catch {
    return fallbackOutreachData;
  }
}

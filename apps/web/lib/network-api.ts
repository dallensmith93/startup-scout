export type ConnectionStage = "research" | "warm" | "active" | "nurture";
export type ContactChannel = "email" | "linkedin" | "text";

export type Connection = {
  id: string;
  name: string;
  role: string;
  company: string;
  stage: ConnectionStage;
  relationshipStrength: number;
  relationshipReason: string;
  responseLikelihood: number;
  responseReason: string;
  recommendedTiming: string;
  timingReason: string;
  warmPathScore: number;
  lastTouchDate: string;
  lastTouchDays: number;
  nextAction: string;
  nextActionReason: string;
  preferredChannel: ContactChannel;
  notes: string;
};

export type WarmPath = {
  id: string;
  targetCompany: string;
  targetRole: string;
  introLikelihood: number;
  pathSummary: string;
  recommendedContactIds: string[];
  nextStep: string;
  introDraft: string;
};

export type NetworkContactDetail = {
  contact: Connection;
  timeline: Array<{ date: string; title: string; detail: string; reason: string }>;
  messageHistory: Array<{ date: string; channel: string; summary: string; outcome: string; reason: string }>;
  reason: string;
};

export type NetworkData = {
  generatedAt: string;
  focus: string;
  connections: Connection[];
  warmPaths: WarmPath[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const fallbackNetworkData: NetworkData = {
  generatedAt: "2026-03-10",
  focus: "Prioritize warm contacts where intro likelihood and relationship strength are both high.",
  connections: [
    {
      id: "contact-1",
      name: "Avery Kim",
      role: "Engineering Manager",
      company: "OrbitNest",
      stage: "warm",
      relationshipStrength: 78,
      relationshipReason: "Score from deterministic mock state.",
      responseLikelihood: 79,
      responseReason: "Warm stage with recent interaction.",
      recommendedTiming: "Send follow-up today before 2 PM.",
      timingReason: "Recency suggests quick re-engagement.",
      warmPathScore: 81,
      lastTouchDate: "2026-03-04",
      lastTouchDays: 6,
      nextAction: "Share one role-specific proof point and ask for next step.",
      nextActionReason: "Warm contacts convert with specific context.",
      preferredChannel: "email",
      notes: "Positive response to prior intro note."
    },
    {
      id: "contact-2",
      name: "Jordan Hale",
      role: "Founder",
      company: "SignalForge",
      stage: "research",
      relationshipStrength: 52,
      relationshipReason: "New contact with older touchpoint.",
      responseLikelihood: 48,
      responseReason: "New stage lowers expected reply probability.",
      recommendedTiming: "Re-introduce with concise context this week.",
      timingReason: "Long gap requires context reset.",
      warmPathScore: 56,
      lastTouchDate: "2026-02-24",
      lastTouchDays: 14,
      nextAction: "Reference meetup context, then make one focused ask.",
      nextActionReason: "New contacts need context first.",
      preferredChannel: "linkedin",
      notes: "Met at meetup; asked for concise follow-up."
    }
  ],
  warmPaths: [
    {
      id: "wp-contact-1",
      targetCompany: "OrbitNest",
      targetRole: "Engineering Manager",
      introLikelihood: 82,
      pathSummary: "Strong warm path through Avery with recent engagement.",
      recommendedContactIds: ["contact-1"],
      nextStep: "Send a concise update and request direct intro.",
      introDraft: "Hi Avery, quick update on my recent reliability project. If it feels aligned, would you be open to introducing me to the hiring manager at OrbitNest?"
    }
  ]
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function clampScore(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function asChannel(value: string): ContactChannel {
  if (value === "linkedin") return "linkedin";
  if (value === "text") return "text";
  return "email";
}

function asStage(value: unknown): ConnectionStage {
  if (value === "active" || value === "warm" || value === "research" || value === "nurture") return value;
  if (value === "new") return "research";
  return "nurture";
}

function daysToDate(days: number): string {
  const base = new Date();
  base.setDate(base.getDate() - Math.max(0, days));
  return base.toISOString().slice(0, 10);
}

type NetworkApiContact = {
  id?: string;
  name?: string;
  role?: string;
  company?: string;
  stage?: string;
  relationshipScore?: number;
  relationshipScoreReason?: string;
  lastTouchDays?: number;
  notes?: string;
  nextAction?: string;
  nextActionReason?: string;
};

type NetworkApiWarmPath = {
  contactId?: string;
  name?: string;
  company?: string;
  pathScore?: number;
  pathScoreReason?: string;
  introLikelihood?: number;
  introLikelihoodReason?: string;
  recommendedPath?: string;
  recommendedPathReason?: string;
};

function toConnection(row: NetworkApiContact, idx: number): Connection {
  const lastTouchDays = typeof row.lastTouchDays === "number" ? row.lastTouchDays : 7;
  const relationshipStrength = clampScore(row.relationshipScore);
  const responseLikelihood = clampScore(Math.round(relationshipStrength * 0.72 + Math.max(0, 20 - lastTouchDays)));

  return {
    id: asString(row.id, `contact-${idx}`),
    name: asString(row.name, "Unknown contact"),
    role: asString(row.role, "Unknown role"),
    company: asString(row.company, "Unknown company"),
    stage: asStage(row.stage),
    relationshipStrength,
    relationshipReason: asString(row.relationshipScoreReason, "Relationship score from deterministic state."),
    responseLikelihood,
    responseReason: "Likelihood derived from strength and interaction recency.",
    recommendedTiming: lastTouchDays >= 10 ? "Follow up today." : "Follow up within 48 hours.",
    timingReason: `Last touch was ${lastTouchDays} day(s) ago.`,
    warmPathScore: clampScore(Math.round(relationshipStrength * 0.7 + responseLikelihood * 0.3)),
    lastTouchDate: daysToDate(lastTouchDays),
    lastTouchDays,
    nextAction: asString(row.nextAction, "Send one concise update and a focused ask."),
    nextActionReason: asString(row.nextActionReason, "Next action based on stage and recency."),
    preferredChannel: asChannel(lastTouchDays > 7 ? "linkedin" : "email"),
    notes: asString(row.notes, "No notes yet.")
  };
}

function toWarmPath(row: NetworkApiWarmPath, idx: number): WarmPath {
  const id = asString(row.contactId, `contact-${idx}`);
  const company = asString(row.company, "Unknown company");
  const name = asString(row.name, "this contact");
  const draft = `Hi ${name.split(" ")[0]}, quick update on role fit with ${company}. If aligned, would you be open to an intro to the hiring owner?`;

  return {
    id: `wp-${id}`,
    targetCompany: company,
    targetRole: "Target role",
    introLikelihood: clampScore(row.introLikelihood),
    pathSummary: asString(row.recommendedPath, "Warm path identified from relationship strength and role relevance."),
    recommendedContactIds: [id],
    nextStep: asString(row.recommendedPathReason, "Share one concrete proof point then request intro."),
    introDraft: draft
  };
}

export async function getNetworkData(): Promise<NetworkData> {
  try {
    const [networkRes, warmRes] = await Promise.all([
      fetch(`${API_BASE.replace(/\/$/, "")}/network`, { cache: "no-store" }),
      fetch(`${API_BASE.replace(/\/$/, "")}/warm-paths`, { cache: "no-store" })
    ]);

    if (!networkRes.ok || !warmRes.ok) throw new Error("network endpoints failed");

    const networkJson = (await networkRes.json()) as { generatedForDate?: string; reason?: string; contacts?: NetworkApiContact[] };
    const warmJson = (await warmRes.json()) as { items?: NetworkApiWarmPath[] };

    const connections = Array.isArray(networkJson.contacts)
      ? networkJson.contacts.map((row, idx) => toConnection(row, idx))
      : [];

    const warmPaths = Array.isArray(warmJson.items)
      ? warmJson.items.map((row, idx) => toWarmPath(row, idx))
      : [];

    if (connections.length === 0) throw new Error("empty connections");

    const best = connections
      .slice()
      .sort((a, b) => b.responseLikelihood - a.responseLikelihood)[0];

    return {
      generatedAt: asString(networkJson.generatedForDate, new Date().toISOString()),
      focus: best
        ? `Prioritize ${best.name} at ${best.company}; highest near-term reply likelihood with clear next action.`
        : fallbackNetworkData.focus,
      connections,
      warmPaths
    };
  } catch {
    return fallbackNetworkData;
  }
}

export async function getNetworkContactById(id: string): Promise<NetworkContactDetail | null> {
  try {
    const response = await fetch(`${API_BASE.replace(/\/$/, "")}/network/${id}`, { cache: "no-store" });
    if (!response.ok) return null;

    const payload = (await response.json()) as {
      contact?: NetworkApiContact;
      timeline?: Array<{ date?: string; title?: string; detail?: string; reason?: string }>;
      messageHistory?: Array<{ date?: string; channel?: string; summary?: string; outcome?: string; reason?: string }>;
      reason?: string;
    };

    if (!payload.contact) return null;
    const contact = toConnection(payload.contact, 0);
    return {
      contact,
      timeline: Array.isArray(payload.timeline)
        ? payload.timeline.map((entry) => ({
            date: asString(entry.date, "Unknown date"),
            title: asString(entry.title, "Timeline event"),
            detail: asString(entry.detail, "No details provided."),
            reason: asString(entry.reason, "Timeline reason unavailable.")
          }))
        : [],
      messageHistory: Array.isArray(payload.messageHistory)
        ? payload.messageHistory.map((entry) => ({
            date: asString(entry.date, "Unknown date"),
            channel: asString(entry.channel, "email"),
            summary: asString(entry.summary, "No message summary."),
            outcome: asString(entry.outcome, "No outcome recorded."),
            reason: asString(entry.reason, "Message reason unavailable.")
          }))
        : [],
      reason: asString(payload.reason, "Network detail generated from deterministic contact history.")
    };
  } catch {
    return null;
  }
}

export function getStageLabel(stage: ConnectionStage) {
  if (stage === "research") return "Research";
  if (stage === "warm") return "Warm";
  if (stage === "active") return "Active";
  return "Nurture";
}

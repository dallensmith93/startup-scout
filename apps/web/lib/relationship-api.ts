export type CoolingRelationship = {
  id: string;
  contactName: string;
  company: string;
  daysSinceTouch: number;
  riskLevel: "moderate" | "high";
  nextMessage: string;
};

export type FollowupUrgency = {
  id: string;
  contactName: string;
  company: string;
  deadlineDate: string;
  urgencyScore: number;
  rationale: string;
  copyReadyFollowup: string;
};

export type NeglectedLead = {
  id: string;
  contactName: string;
  company: string;
  missedMoments: number;
  suggestedAction: string;
};

export type RelationshipHealthData = {
  generatedAt: string;
  overallScore: number;
  momentumSummary: string;
  coolingOff: CoolingRelationship[];
  followupUrgency: FollowupUrgency[];
  neglectedLeads: NeglectedLead[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const fallbackRelationshipHealth: RelationshipHealthData = {
  generatedAt: "2026-03-10",
  overallScore: 74,
  momentumSummary: "Most key relationships are stable, but two contacts need immediate touchpoints.",
  coolingOff: [
    {
      id: "contact-2",
      contactName: "Jordan Hale",
      company: "SignalForge",
      daysSinceTouch: 14,
      riskLevel: "high",
      nextMessage: "Re-introduce context and ask one specific process question."
    }
  ],
  followupUrgency: [
    {
      id: "contact-1",
      contactName: "Avery Kim",
      company: "OrbitNest",
      deadlineDate: "2026-03-11",
      urgencyScore: 89,
      rationale: "High relationship score with active timing window.",
      copyReadyFollowup: "Hi Avery, quick follow-up with one concrete update and a clear ask on next step."
    }
  ],
  neglectedLeads: [
    {
      id: "contact-3",
      contactName: "Riley Chen",
      company: "Nimbus Grid",
      missedMoments: 1,
      suggestedAction: "Send short update and ask for role timeline."
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

function deadlineFromUrgency(score: number): string {
  const date = new Date();
  if (score >= 85) {
    date.setDate(date.getDate() + 1);
  } else if (score >= 70) {
    date.setDate(date.getDate() + 2);
  } else {
    date.setDate(date.getDate() + 4);
  }
  return date.toISOString().slice(0, 10);
}

export async function getRelationshipHealthData(): Promise<RelationshipHealthData> {
  try {
    const response = await fetch(`${API_BASE.replace(/\/$/, "")}/relationship-health`, { cache: "no-store" });
    if (!response.ok) throw new Error("relationship-health failed");

    const payload = (await response.json()) as {
      generatedForDate?: string;
      summary?: { reason?: string };
      items?: Array<{
        contactId?: string;
        name?: string;
        company?: string;
        healthScore?: number;
        staleRiskScore?: number;
        urgency?: string;
        nextTouchRecommendation?: string;
        nextTouchReason?: string;
        reason?: string;
      }>;
    };

    const items = Array.isArray(payload.items) ? payload.items : [];
    if (!items.length) throw new Error("no items");

    const overallScore = clampScore(
      Math.round(items.reduce((sum, item) => sum + clampScore(item.healthScore), 0) / items.length)
    );

    const coolingOff = items
      .filter((item) => clampScore(item.staleRiskScore) >= 55)
      .map((item) => ({
        id: asString(item.contactId, "contact"),
        contactName: asString(item.name, "Unknown contact"),
        company: asString(item.company, "Unknown company"),
        daysSinceTouch: Math.max(1, Math.round(clampScore(item.staleRiskScore) / 6)),
        riskLevel: (clampScore(item.staleRiskScore) >= 75 ? "high" : "moderate") as "high" | "moderate",
        nextMessage: asString(item.nextTouchRecommendation, "Share a concise update and one next-step ask.")
      }));

    const followupUrgency = items
      .map((item) => {
        const urgencyScore = clampScore(100 - clampScore(item.healthScore) + clampScore(item.staleRiskScore) * 0.4);
        return {
          id: asString(item.contactId, "contact"),
          contactName: asString(item.name, "Unknown contact"),
          company: asString(item.company, "Unknown company"),
          deadlineDate: deadlineFromUrgency(urgencyScore),
          urgencyScore,
          rationale: asString(item.nextTouchReason, "Urgency is based on relationship health and staleness."),
          copyReadyFollowup: `Hi ${asString(item.name, "there").split(" ")[0]}, quick follow-up: ${asString(
            item.nextTouchRecommendation,
            "sharing one concise update and a specific next step"
          )}`
        };
      })
      .sort((a, b) => b.urgencyScore - a.urgencyScore)
      .slice(0, 3);

    const neglectedLeads = items
      .filter((item) => asString(item.urgency, "low") !== "low")
      .map((item) => ({
        id: asString(item.contactId, "contact"),
        contactName: asString(item.name, "Unknown contact"),
        company: asString(item.company, "Unknown company"),
        missedMoments: asString(item.urgency, "medium") === "high" ? 2 : 1,
        suggestedAction: asString(item.reason, "Re-engage with targeted follow-up this week.")
      }));

    return {
      generatedAt: asString(payload.generatedForDate, new Date().toISOString()),
      overallScore,
      momentumSummary: asString(payload.summary?.reason, "Health summary derived from deterministic scoring."),
      coolingOff: coolingOff.length ? coolingOff : fallbackRelationshipHealth.coolingOff,
      followupUrgency: followupUrgency.length ? followupUrgency : fallbackRelationshipHealth.followupUrgency,
      neglectedLeads: neglectedLeads.length ? neglectedLeads : fallbackRelationshipHealth.neglectedLeads
    };
  } catch {
    return fallbackRelationshipHealth;
  }
}

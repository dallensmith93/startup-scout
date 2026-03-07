export type StartupStatus = "approved" | "review" | "rejected" | "expired";

export type AiCategory =
  | "agent"
  | "copilot"
  | "automation"
  | "developer-tool"
  | "ml-system"
  | "search-analysis"
  | "general-ai";

export type StartupRecord = {
  id: string;
  name: string;
  website: string;
  domain: string;
  description: string;
  sources: string[];
  firstSeenAt: string;
  freshnessHours: number;
  usaConfidence: number;
  scamScore: number;
  aiRelevanceScore: number;
  aiCategory: AiCategory;
  hiringUrgencyScore: number;
  openRoles?: string[];
  applyUrl?: string;
  careersUrl?: string;
  status: StartupStatus;
};

export type StartupCandidate = {
  name: string;
  website?: string;
  domain?: string;
  description?: string;
  source: "producthunt" | "yc" | "jobs";
  firstSeenAt?: string;
  tags?: string[];
  text?: string;
  applyUrl?: string;
  careersUrl?: string;
  openRoles?: string[];
};

export type StartupsResponse = {
  approved: StartupRecord[];
  review: StartupRecord[];
};

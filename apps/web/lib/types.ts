export type Intelligence = {
  marketCategory: string;
  fundingStage: string;
  hiringProbability: number;
  founderSignals: string[];
  aiFocus: string[];
  summary: string;
};

export type StartupRecord = {
  id: string;
  name: string;
  domain: string;
  website: string;
  location: string;
  description: string;
  firstSeenAt: string;
  tags: string[];
  openRoles: string[];
  score: number;
  scoreBreakdown: Record<string, number>;
  whyNow: string[];
  intelligence: Intelligence;
};

export type RankingItem = StartupRecord & {
  rank: number;
};

export type HiddenSignal = {
  id: string;
  startupId: string;
  startupName: string;
  signal: string;
  confidence: number;
  whyItMatters: string;
};

export type OutreachRequest = {
  startupId: string;
  tone: "direct" | "warm" | "technical";
  candidateName: string;
  candidatePitch: string;
};

export type OutreachResponse = {
  subject: string;
  message: string;
  highlights: string[];
};

export type ResumeMatchRequest = {
  startupId: string;
  resumeText: string;
  keySkills: string[];
};

export type ResumeMatchResponse = {
  fitScore: number;
  strengths: string[];
  skillGaps: string[];
  recommendations: string[];
};

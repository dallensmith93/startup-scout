export type RiskLevel = "low" | "moderate" | "elevated" | "high";

export type LegitimacyInput = {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  salaryRange?: string;
  recruiterMessage?: string;
  postingUrl?: string;
  companyWebsite?: string;
  notes?: string;
};

export type LegitimacyResult = {
  reportId: string;
  legitimacyScore: number;
  scamRiskScore: number;
  confidence: number;
  riskLevel: RiskLevel;
  trustSignals: string[];
  redFlags: string[];
  explanationSummary: string;
  recommendedAction: string;
  suggestedFollowupQuestions: string[];
  evidence: {
    scoreBreakdown: Record<string, number>;
    positiveEvidence: string[];
    riskEvidence: string[];
  };
};

export type RecruiterCheckInput = {
  message: string;
  recruiterName?: string;
  recruiterEmail?: string;
  companyName?: string;
};

export type RecruiterCheckResult = {
  authenticityScore: number;
  riskLevel: RiskLevel;
  confidence: number;
  trustSignals: string[];
  redFlags: string[];
  explanationSummary: string;
  followupQuestions: string[];
};

export type CompanyCheckInput = {
  companyName: string;
  website: string;
  domain: string;
  postingUrl?: string;
};

export type CompanyCheckResult = {
  legitimacyScore: number;
  domainTrust: number;
  consistencyScore: number;
  confidence: number;
  riskLevel: RiskLevel;
  surfaceSignals: string[];
  redFlags: string[];
  explanationSummary: string;
  recommendedAction: string;
};

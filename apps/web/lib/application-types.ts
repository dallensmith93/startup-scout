export type ApplicationStatus = "saved" | "tailoring" | "applied" | "interview" | "offer" | "rejected";

export type ApplicationRecord = {
  id: string;
  startupId: string;
  startupName: string;
  roleTitle: string;
  location: string;
  compensationBand: string;
  roleSummary: string;
  jobDescription: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  riskSignals: string[];
  status: ApplicationStatus;
  stage: string;
  lastTouchAt: string;
};

export type FitCategory = {
  label: string;
  score: number;
  reasoning: string[];
};

export type KeywordGapReport = {
  matchedKeywords: string[];
  missingKeywords: string[];
  overlapScore: number;
};

export type ApplicationFitResult = {
  applicationId: string;
  fitScore: number;
  fitSummary: FitCategory;
  riskSummary: FitCategory;
  keywordGapReport: KeywordGapReport;
  tailoredIntroParagraph: string;
  tailoredResumeBullets: string[];
  strongestRelevantExperience: string;
  recommendedNextStep: string;
  evidence: Record<string, unknown>;
  reasoning: string[];
};

export type TailoringResult = {
  applicationId: string;
  matchScore: number;
  keywordAnalysis: string[];
  tailoredIntroParagraph: string;
  suggestedBullets: string[];
  resumeDiffSummary: string[];
  keywordGapReport: KeywordGapReport;
  strongestRelevantExperience: string;
  reasoning: string[];
};

export type TrackerItem = {
  applicationId: string;
  startupName: string;
  roleTitle: string;
  status: ApplicationStatus;
  stage: string;
  note: string;
  updatedAt: string;
  nextAction: string;
};

export type TrackerResponse = {
  total: number;
  items: TrackerItem[];
};

export type FollowupReminder = {
  applicationId: string;
  startupName: string;
  roleTitle: string;
  urgency: "low" | "medium" | "high";
  reason: string;
  suggestedMessage: string;
};

export type InterviewPrepResult = {
  applicationId: string;
  talkingPoints: string[];
  likelyQuestions: string[];
  questionsToAskEmployer: string[];
  prepChecklist: string[];
  reasoning: string[];
};

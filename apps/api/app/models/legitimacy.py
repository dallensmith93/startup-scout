from pydantic import BaseModel


class LegitimacyRequest(BaseModel):
    jobTitle: str
    companyName: str
    jobDescription: str
    salaryRange: str | None = None
    recruiterMessage: str | None = None
    postingUrl: str | None = None
    companyWebsite: str | None = None
    notes: str | None = None


class LegitimacyResponse(BaseModel):
    reportId: str
    legitimacyScore: int
    scamRiskScore: int
    confidence: float
    riskLevel: str
    trustSignals: list[str]
    redFlags: list[str]
    explanationSummary: str
    recommendedAction: str
    suggestedFollowupQuestions: list[str]
    evidence: dict[str, list[str] | dict[str, int]]

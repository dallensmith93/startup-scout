from pydantic import BaseModel


class RecruiterCheckRequest(BaseModel):
    message: str
    recruiterName: str | None = None
    recruiterEmail: str | None = None
    companyName: str | None = None


class RecruiterCheckResponse(BaseModel):
    authenticityScore: int
    riskLevel: str
    confidence: float
    trustSignals: list[str]
    redFlags: list[str]
    explanationSummary: str
    followupQuestions: list[str]

from pydantic import BaseModel


class CompanyCheckRequest(BaseModel):
    companyName: str
    website: str
    domain: str
    postingUrl: str | None = None


class CompanyCheckResponse(BaseModel):
    legitimacyScore: int
    domainTrust: int
    consistencyScore: int
    confidence: float
    riskLevel: str
    surfaceSignals: list[str]
    redFlags: list[str]
    explanationSummary: str
    recommendedAction: str

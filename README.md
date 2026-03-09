# Startup Scout (Phase 3)

Startup Scout is a job-search intelligence platform. In Phase 3, it adds **Job Legitimacy Checking** to help users evaluate risk and trust in job opportunities.

## Phase 3 Capabilities

- Analyze job postings for legitimacy signals
- Detect scam patterns and suspicious language
- Evaluate recruiter outreach quality and risk
- Assess company surface credibility and domain consistency
- Generate explainable legitimacy reports with balanced risk language

## Key Pages

- `/legitimacy`
- `/recruiter-check`
- `/company-check`
- `/job-report/[id]`

## Risk Framing

This tool is a **risk analysis assistant**, not a certainty engine.
It returns:
- legitimacy score
- scam risk score
- confidence
- trust signals
- red flags
- explanation summary
- recommended action
- follow-up questions

Risk labels are intentionally balanced:
- `low`
- `moderate`
- `elevated`
- `high`

## Architecture

### Frontend (`apps/web`)
- Next.js App Router + TypeScript
- Premium dark shell
- Phase 3 components under:
  - `components/legitimacy`
  - `components/recruiter`
  - `components/company`
  - `components/report`
- API utilities:
  - `lib/legitimacy-api.ts`
  - `lib/legitimacy-types.ts`

### Backend (`apps/api`)
- FastAPI
- Routers:
  - `legitimacy.py`
  - `recruiter_check.py`
  - `company_check.py`
- Services:
  - legitimacy analyzer
  - scam signal engine
  - posting quality checker
  - recruiter message analyzer
  - company surface checker
  - domain consistency checker
  - compensation risk checker
  - legitimacy explainer
- Pattern data:
  - `app/data/suspicious_patterns.json`
  - `app/data/trusted_patterns.json`

## Setup

Install frontend deps:

```bash
pnpm install
```

Install backend deps:

```bash
python -m pip install -r apps/api/requirements.txt
```

Run backend:

```bash
pnpm dev:api
```

Run frontend:

```bash
pnpm dev:web
```

Default URLs:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

Optional frontend API override:
- `apps/web/.env.local`
- `NEXT_PUBLIC_API_URL=http://localhost:8000`

## Tests

Run backend tests:

```bash
pnpm test:api
```

Phase 3 coverage includes:
- legitimacy analyzer
- scam signal engine
- recruiter message analyzer
- company surface checker
- compensation risk checker

## Example Workflow

1. Open `/legitimacy` and submit posting + recruiter/company details.
2. Review score, risk level, confidence, trust signals, and red flags.
3. Open `/job-report/[id]` for explainable evidence and follow-up questions.
4. Run `/recruiter-check` on outreach text.
5. Run `/company-check` for domain and surface credibility.

## Limitations

- Heuristic system (deterministic), not a legal/compliance verdict
- Uses mock and pattern-driven analysis in this phase
- Should support decision-making, not replace human judgment

## Future Roadmap

- OSINT enrichments (domain age, public company registry checks)
- Advanced message provenance and impersonation detection
- Saved report history and collaboration notes
- Evidence linking to external verification sources

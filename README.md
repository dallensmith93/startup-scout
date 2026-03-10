# Startup Scout (Phase 7)

Startup Scout is a **Proactive Job Search Assistant** that now treats networking as a first-class growth channel alongside applications.

## Overview

Phase 7 expands the operating loop from "apply better" to "create more interview paths" through targeted networking intelligence and guided execution.

- Proactive next-action queue for applications and outreach
- Opportunity prioritization with timing and impact signals
- Weekly planning, execution tracking, and review loop
- Pipeline analytics with bottleneck visibility
- Explainable recommendations across all core decisions

## Networking Intelligence

Phase 7 introduces networking intelligence to help users identify and act on relationship-based opportunities, not just posted roles.

- Contact and company signal scoring to highlight warm-path potential
- Suggested outreach targets aligned to active priority roles
- Follow-up timing cues to reduce dropped conversations
- Relationship-aware task generation integrated with the weekly plan

## Frontend Refresh Notes

- Refined dashboard and task surfaces to blend application and networking actions in one queue
- Clearer priority and status treatments for faster triage
- Updated page-level summaries to show outreach impact alongside funnel metrics
- Continued Next.js App Router + TypeScript foundation with domain-based components

## Architecture Summary

### Frontend (`apps/web`)

- Next.js App Router + TypeScript UI layer
- Route pages for dashboard, priorities, planner, tasks, analytics, and weekly reports
- Shared domain components under `components/*`
- API client modules under `lib/*-api.ts`

### Backend (`apps/api`)

- FastAPI service layer with deterministic, explainable outputs
- Routers for dashboard, planner, priorities, tasks, analytics, and report flows
- Services covering prioritization, planning, analytics, follow-ups, and networking signal logic
- Pydantic models for typed request/response contracts

## Setup and Tests

```bash
pnpm install
python -m pip install -r apps/api/requirements.txt
```

```bash
pnpm dev:api
pnpm dev:web
```

```bash
pnpm test:api
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:8000`

Optional (`apps/web/.env.local`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Live startup + job feeds (`apps/api/.env`):

```bash
# optional startup source (JSON array or { "startups": [...] })
LIVE_STARTUPS_URL=

# live AI jobs via SerpAPI Google Jobs
LIVE_JOB_PROVIDER=serpapi
SERPAPI_KEY=
LIVE_JOB_LOCATION=United States
LIVE_JOB_RESULTS_PER_COMPANY=3
```

Notes:
- Without `SERPAPI_KEY`, Startup Scout falls back to local mock roles.
- Live jobs are filtered to postings surfaced from `Indeed`, `LinkedIn`, and `Glassdoor` sources when available in results.

## Workflow (Phase 7)

1. Review search and networking health in `/dashboard`.
2. Select top opportunities and outreach paths in `/priorities`.
3. Commit the week in `/planner`.
4. Execute applications and networking tasks in `/tasks`.
5. Monitor conversion and outreach response in `/analytics`.
6. Close the week and recalibrate in `/reports/weekly`.

## Roadmap

- Deeper relationship graphing and contact history context
- More adaptive outreach sequencing from response behavior
- Shared coaching views for guided accountability

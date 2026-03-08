# Startup Scout - Phase 2

Startup Scout is an AI-powered startup discovery and targeting product for job seekers.

It helps you:
- discover high-signal startups
- understand opportunity quality with explainable intelligence scores
- generate founder outreach messages
- surface hidden startup opportunities
- evaluate resume-to-startup fit with concrete skill gaps

## Product Pages

- `/` Dashboard: high-priority opportunities and intelligence snapshots
- `/discover`: searchable and filterable startup list
- `/rankings`: transparent opportunity ranking table with score breakdowns
- `/outreach`: editable outreach generator with tone selection
- `/hidden-startups`: hidden signal feed with why-it-matters context
- `/resume-match`: fit score and skill gap analyzer
- `/startups/[id]`: startup detail profile

## Architecture

### Frontend (Next.js + TypeScript)
- Location: `apps/web`
- Next.js App Router
- Reusable UI primitives: shell, startup card, score badge
- API client in `apps/web/lib/api.ts`
- Premium dark UI with cohesive sidebar shell

### Backend (FastAPI + Python)
- Location: `apps/api`
- Entrypoint: `apps/api/app/main.py`
- Routers:
  - `startups`
  - `rankings`
  - `outreach`
  - `hidden-startups`
  - `resume-match`
- Services:
  - startup analyzer
  - funding classifier
  - hiring probability
  - opportunity score
  - outreach generator
  - hidden startup detector
  - founder signal tracker
  - resume matcher
  - market classifier
- Mock data: `apps/api/app/data/mock_startups.json`

## API Endpoints

- `GET /health`
- `GET /startups`
- `GET /startups/{id}`
- `GET /rankings`
- `POST /outreach/generate`
- `GET /hidden-startups`
- `POST /resume-match/analyze`

## Local Setup

### 1) Frontend
```bash
pnpm install
pnpm dev:web
```
Frontend runs on `http://localhost:3000`.

### 2) Backend
```bash
python -m pip install -r apps/api/requirements.txt
pnpm dev:api
```
Backend runs on `http://localhost:8000`.

If needed, set frontend API URL:
- `apps/web/.env.local`
- `NEXT_PUBLIC_API_URL=http://localhost:8000`

## Tests

```bash
pnpm test:api
```

Covers deterministic logic for:
- opportunity scoring
- funding classification
- hidden startup detection
- resume matching

## Demo Flow

1. Open dashboard to see priority opportunities.
2. Go to Discover and filter by score/search.
3. Open Rankings to explain scoring logic.
4. Use Outreach generator and edit output.
5. Show Hidden Startups to surface non-obvious plays.
6. Run Resume Match to show fit score + skill gaps.
7. Open Startup Detail to show AI intelligence and founder signals.

## Roadmap

- Live connectors for Product Hunt, YC, and hiring feeds
- Saved job-search workspace and profile memory
- Outreach history + experiment tracking
- Deeper resume parsing and project evidence extraction
- Team mode for recruiters and career coaches

# Startup Scout

Lean monorepo vertical slice for startup discovery.

## Structure

- `apps/web` Vite + React + TypeScript UI
- `apps/api` Node + TypeScript API
- `packages/shared` shared types and deterministic business rules

## Environment Variables

API (`apps/api/.env.example`):
- `API_PORT` default `3001`
- `PRODUCTHUNT_TOKEN` optional in phase 1 (mock fallback used when missing)
- `YC_SOURCE_URL` optional in phase 1 (mock fallback used when missing)

Web:
- `VITE_API_URL` default `http://localhost:3001/api`
  - set in `apps/web/.env` (or `.env.local`)

## Quickstart

1. Install dependencies:

```bash
pnpm install
```

2. Start API:

```bash
pnpm --filter api dev
```

3. Start Web:

```bash
pnpm --filter web dev
```

4. Run ingest:

```bash
curl -X POST http://localhost:3001/api/ingest/run
```

5. Prune expired records:

```bash
curl -X POST http://localhost:3001/api/prune/expired
```

## End-to-End Flow

1. `POST /api/ingest/run` pulls candidates from connectors and normalizes fields.
2. API scoring applies deterministic rules: freshness, USA confidence, scam risk, AI relevance, hiring urgency.
3. Status assignment:
   - `approved` => appears on Dashboard
   - `review` => appears on Review Queue
   - `rejected` and `expired` => hidden from Dashboard
4. Review actions:
   - `POST /api/review/:id/approve`
   - `POST /api/review/:id/reject`
5. Apply button fallback order in UI:
   - `applyUrl`
   - `careersUrl`
   - `website`

## API Endpoints

- `GET /api/health`
- `GET /api/startups`
- `POST /api/ingest/run`
- `POST /api/review/:id/approve`
- `POST /api/review/:id/reject`
- `POST /api/prune/expired`

## Tests

Run API tests:

```bash
pnpm --filter api test
```

## Troubleshooting

- Missing Product Hunt token:
  - Phase 1 uses deterministic fallback candidates so ingest still works.
- YC source unavailable:
  - Fallback candidates are used to keep the vertical slice functional.
- No startups returned:
  - Run `POST /api/ingest/run` and confirm API is reachable at `VITE_API_URL`.
- Stale records still present:
  - Run `POST /api/prune/expired`.
- Apply link missing:
  - UI falls back `applyUrl -> careersUrl -> website`; ensure at least website exists.

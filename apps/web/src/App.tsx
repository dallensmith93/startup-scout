import { useEffect, useMemo, useState } from "react";
import { type FilterState } from "./components/FilterBar";
import {
  approveReview,
  getHealth,
  getStartups,
  pruneExpired,
  rejectReview,
  runIngest,
  type StartupsResponse
} from "./lib/api";
import Dashboard from "./pages/Dashboard";
import ReviewQueue from "./pages/ReviewQueue";

const initialFilters: FilterState = {
  minAiRelevance: 45,
  minHiringUrgency: 45,
  aiCategory: "all",
  onlyWithApplyLink: false,
  maxFreshnessHours: 48
};

export default function App() {
  const [data, setData] = useState<StartupsResponse>({ approved: [], review: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [activeView, setActiveView] = useState<"dashboard" | "review" | "api">("dashboard");

  const stats = useMemo(
    () => ({ approved: data.approved.length, review: data.review.length }),
    [data.approved.length, data.review.length]
  );

  async function refresh() {
    setLoading(true);
    try {
      setData(await getStartups());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh().catch(() => setMessage("Failed to load API data. Start backend and run ingest."));
  }, []);

  async function onIngest() {
    const result = await runIngest();
    setMessage(
      `Ingested ${result.total}. approved=${result.approved} review=${result.review} rejected=${result.rejected} expired=${result.expired}`
    );
    await refresh();
  }

  async function onPrune() {
    const result = await pruneExpired();
    setMessage(`Pruned ${result.prunedCount} expired records.`);
    await refresh();
  }

  async function onApprove(id: string) {
    await approveReview(id);
    await refresh();
  }

  async function onReject(id: string) {
    await rejectReview(id);
    await refresh();
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Startup Scout</h1>
          <p>USA + fresh + real AI + urgent hiring</p>
        </div>
        <nav>
          <button className={activeView === "dashboard" ? "active" : ""} onClick={() => setActiveView("dashboard")}>
            Dashboard
          </button>
          <button className={activeView === "review" ? "active" : ""} onClick={() => setActiveView("review")}>
            Review Queue
          </button>
          <button className={activeView === "api" ? "active" : ""} onClick={() => setActiveView("api")}>
            API Tools
          </button>
        </nav>
      </header>

      <section className="toolbar">
        <button className="btn" onClick={() => onIngest().catch(() => setMessage("Ingest failed."))}>
          Run Ingest
        </button>
        <button className="btn ghost" onClick={() => onPrune().catch(() => setMessage("Prune failed."))}>
          Prune Expired
        </button>
        <span className="badge">Approved: {stats.approved}</span>
        <span className="badge">Review: {stats.review}</span>
        {message && <span className="hint">{message}</span>}
      </section>

      <main>
        {activeView === "dashboard" && (
          <Dashboard items={data.approved} filters={filters} onFilterChange={setFilters} loading={loading} />
        )}
        {activeView === "review" && (
          <ReviewQueue
            items={data.review}
            filters={filters}
            onFilterChange={setFilters}
            onApprove={onApprove}
            onReject={onReject}
            loading={loading}
          />
        )}
        {activeView === "api" && (
          <section className="api-tools">
            <h2>API Tools</h2>
            <p className="hint">Use these to quickly verify the backend while testing UI flows.</p>
            <div className="api-grid">
              <a className="api-link" href="http://localhost:3001/api/health" target="_blank" rel="noreferrer">
                GET /api/health
              </a>
              <a className="api-link" href="http://localhost:3001/api/startups" target="_blank" rel="noreferrer">
                GET /api/startups
              </a>
              <button
                className="btn"
                onClick={() =>
                  getHealth()
                    .then((r) => setMessage(`Health ok=${String(r.ok)}`))
                    .catch(() => setMessage("Health check failed. Is API running on :3001?"))
                }
              >
                Check API Health
              </button>
              <button className="btn ghost" onClick={() => refresh().catch(() => setMessage("Refresh failed."))}>
                Refresh Startup Lists
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

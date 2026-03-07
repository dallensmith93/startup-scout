import type { StartupRecord } from "../lib/api";

type Props = {
  startup: StartupRecord;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
};

function pickApplyLink(startup: StartupRecord): string {
  return startup.applyUrl || startup.careersUrl || startup.website;
}

export default function StartupCard({ startup, onApprove, onReject }: Props) {
  const applyLink = pickApplyLink(startup);
  const hasApply = Boolean(applyLink);
  const roles = (startup.openRoles ?? []).join(", ");

  return (
    <article className="startup-card">
      <div className="card-header">
        <h3>{startup.name}</h3>
        <span className={`status-pill ${startup.status}`}>{startup.status}</span>
      </div>

      <p>{startup.description || "No description"}</p>

      <div className="source-row">
        {startup.sources.map((source) => (
          <span key={`${startup.id}-${source}`} className="source-chip">
            {source}
          </span>
        ))}
      </div>

      <div className="meta-grid">
        <span className="meta-item"><strong>Freshness</strong> {startup.freshnessHours}h</span>
        <span className="meta-item"><strong>USA</strong> {startup.usaConfidence.toFixed(2)}</span>
        <span className="meta-item"><strong>Scam</strong> {startup.scamScore}</span>
        <span className="meta-item"><strong>AI</strong> {startup.aiRelevanceScore}</span>
        <span className="meta-item"><strong>Category</strong> {startup.aiCategory}</span>
        <span className="meta-item"><strong>Hiring</strong> {startup.hiringUrgencyScore}</span>
        <span className="meta-item meta-wide"><strong>Roles</strong> {roles || "n/a"}</span>
      </div>

      <div className="card-actions">
        <a className={`btn apply ${hasApply ? "" : "disabled"}`} href={hasApply ? applyLink : undefined} target="_blank" rel="noreferrer">
          Apply
        </a>
        {onApprove && (
          <button className="btn" onClick={() => onApprove(startup.id)}>
            Approve
          </button>
        )}
        {onReject && (
          <button className="btn ghost" onClick={() => onReject(startup.id)}>
            Reject
          </button>
        )}
      </div>
    </article>
  );
}

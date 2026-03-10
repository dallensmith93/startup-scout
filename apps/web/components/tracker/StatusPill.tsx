import { type TrackerStatus } from "../../lib/tracker-api";

type StatusPillProps = {
  status: TrackerStatus;
};

const statusMap: Record<TrackerStatus, { label: string; className: string }> = {
  saved: { label: "Saved", className: "mid" },
  applied: { label: "Applied", className: "high" },
  interview: { label: "Interview", className: "high" },
  offer: { label: "Offer", className: "high" },
  rejected: { label: "Closed", className: "low" }
};

export function StatusPill({ status }: StatusPillProps) {
  const mapped = statusMap[status];
  return <span className={`score-badge ${mapped.className}`}>{mapped.label}</span>;
}


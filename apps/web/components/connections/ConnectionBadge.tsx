import type { Connection } from "../../lib/network-api";

type ConnectionBadgeProps = {
  connection: Connection;
};

function scoreClass(score: number) {
  if (score >= 80) return "score-badge high";
  if (score >= 60) return "score-badge mid";
  return "score-badge low";
}

export function ConnectionBadge({ connection }: ConnectionBadgeProps) {
  return (
    <div className="chip-row" style={{ margin: "8px 0 0" }}>
      <span className={scoreClass(connection.relationshipStrength)}>
        Strength {connection.relationshipStrength}
      </span>
      <span className={scoreClass(connection.warmPathScore)}>Warm Path {connection.warmPathScore}</span>
      <span className="chip">Last touch {connection.lastTouchDate}</span>
    </div>
  );
}

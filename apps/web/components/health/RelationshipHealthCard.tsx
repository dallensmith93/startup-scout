type RelationshipHealthCardProps = {
  score: number;
  summary: string;
};

export function RelationshipHealthCard({ score, summary }: RelationshipHealthCardProps) {
  return (
    <section className="card accent-card">
      <p className="dashboard-mini-head">Relationship health</p>
      <h3 style={{ margin: "4px 0 6px" }}>Connection Momentum</h3>
      <p className="hero-score" style={{ margin: 0 }}>{score}</p>
      <div className="meter" style={{ marginTop: 10 }}>
        <span style={{ width: `${score}%` }} />
      </div>
      <p className="muted" style={{ marginBottom: 0, marginTop: 10 }}>{summary}</p>
    </section>
  );
}

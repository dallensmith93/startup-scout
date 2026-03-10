type RelationshipStrengthMeterProps = {
  score: number;
  reason: string;
};

export function RelationshipStrengthMeter({ score, reason }: RelationshipStrengthMeterProps) {
  return (
    <section className="card">
      <div className="row-end">
        <h4 style={{ margin: 0 }}>Relationship Strength</h4>
        <span className="score-badge high">{score}</span>
      </div>
      <div className="meter" style={{ marginTop: 10 }}>
        <span style={{ width: `${score}%` }} />
      </div>
      <p className="muted" style={{ marginTop: 10 }}>{reason}</p>
    </section>
  );
}

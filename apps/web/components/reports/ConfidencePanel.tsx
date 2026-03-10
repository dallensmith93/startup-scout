export function ConfidencePanel({ confidence, reason }: { confidence: number; reason: string }) {
  const label = confidence >= 75 ? "Execution outlook is strong" : confidence >= 55 ? "Execution outlook is stable" : "Execution risk is elevated";

  return (
    <section className="card">
      <h3>Confidence</h3>
      <p className="hero-score" style={{ marginBottom: 4 }}>{confidence}%</p>
      <div className="meter">
        <span style={{ width: `${Math.max(0, Math.min(100, confidence))}%` }} />
      </div>
      <p style={{ marginTop: 10, marginBottom: 0 }}>{label}</p>
      <p className="muted">{reason}</p>
    </section>
  );
}

export function WeeklySummaryHeader({ weekOf, confidence }: { weekOf: string; confidence: number }) {
  const label = confidence >= 75 ? "High confidence" : confidence >= 55 ? "Moderate confidence" : "Low confidence";

  return (
    <section className="card accent-card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>Weekly Review</h3>
        <span className={`status-pill ${confidence >= 75 ? "offer" : confidence >= 55 ? "tailoring" : "rejected"}`}>{label}</span>
      </div>
      <p className="muted">Week of {weekOf}</p>
      <p style={{ marginBottom: 0 }}>Reflect, adjust, and commit to next-week execution.</p>
    </section>
  );
}

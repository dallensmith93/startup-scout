export function TrendCard({ momentum }: { momentum: number }) {
  return (
    <section className="card">
      <h3>Trend</h3>
      <p>{momentum >= 70 ? "Positive momentum trend" : "Momentum needs intervention"}</p>
      <p className="muted">Current momentum score: {momentum}</p>
    </section>
  );
}

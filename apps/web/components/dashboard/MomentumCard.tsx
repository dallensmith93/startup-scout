export function MomentumCard({ score }: { score: number }) {
  return (
    <section className="card">
      <h3>Momentum Score</h3>
      <p className="hero-score">{score}</p>
      <div className="meter"><span style={{ width: `${score}%` }} /></div>
      <p className="muted" style={{ marginTop: 10 }}>Higher scores indicate healthy conversion and consistent execution cadence.</p>
    </section>
  );
}

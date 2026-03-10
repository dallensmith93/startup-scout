export function WeeklyFocusScoreCard({ score, target, reason }: { score: number; target: number; reason: string }) {
  const gap = Math.max(0, target - score);

  return (
    <section className="card accent-card">
      <div className="row-end" style={{ alignItems: "flex-start" }}>
        <div>
          <h3 style={{ margin: 0 }}>Weekly Focus Score</h3>
          <p className="muted" style={{ margin: "6px 0 0" }}>How strongly this week aligns with high-conversion moves.</p>
        </div>
        <span className="status-pill tailoring">Target {target}</span>
      </div>
      <p className="hero-score" style={{ marginBottom: 8 }}>{score}</p>
      <div className="meter"><span style={{ width: `${score}%` }} /></div>
      <p className="muted" style={{ marginTop: 10, marginBottom: 0 }}>
        {gap === 0 ? "On-target focus profile. Keep execution quality high." : `${gap} points behind target.`} {reason}
      </p>
    </section>
  );
}

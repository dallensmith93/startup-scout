export function ResponseRateCard({ responseRate }: { responseRate: number }) {
  return (
    <section className="card">
      <h3>Response Rate</h3>
      <p className="hero-score">{responseRate}%</p>
      <p className="muted">Signal quality across applications and outreach.</p>
    </section>
  );
}

type OutreachHubHeroProps = {
  weeklyTarget: number;
  sentThisWeek: number;
  responseRate: number;
};

export function OutreachHubHero({ weeklyTarget, sentThisWeek, responseRate }: OutreachHubHeroProps) {
  const remaining = Math.max(0, weeklyTarget - sentThisWeek);
  const progress = weeklyTarget > 0 ? Math.round((sentThisWeek / weeklyTarget) * 100) : 0;

  return (
    <section className="card accent-card">
      <p className="dashboard-mini-head">Outreach cadence</p>
      <h2 style={{ margin: "4px 0 8px" }}>Keep momentum without noise</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        Use templates and follow-up timing to increase replies while staying concise.
      </p>
      <div className="chip-row">
        <span className="chip">Target {weeklyTarget}</span>
        <span className="chip">Sent {sentThisWeek}</span>
        <span className="chip">Remaining {remaining}</span>
        <span className="chip">Response rate {responseRate}%</span>
      </div>
      <div className="meter" style={{ marginTop: 10 }}>
        <span style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
    </section>
  );
}

export function NudgesHero({ summary }: { summary: string }) {
  return (
    <section className="card brief-hero">
      <p className="dashboard-mini-head">Nudges</p>
      <h2>Actionable Prompts</h2>
      <p className="desc">{summary}</p>
    </section>
  );
}

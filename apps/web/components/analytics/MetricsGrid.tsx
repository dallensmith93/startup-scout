import type { AnalyticsData } from "../../lib/analytics-api";

export function MetricsGrid({ data }: { data: AnalyticsData }) {
  const cards = [
    { label: "Total Applications", value: data.applicationsTotal },
    { label: "Response Rate", value: `${data.responseRate}%` },
    { label: "Interview Rate", value: `${data.interviewRate}%` },
    { label: "Momentum", value: data.momentumScore }
  ];

  return (
    <section className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
      {cards.map((card) => (
        <article key={card.label} className="card">
          <p className="muted" style={{ margin: 0 }}>{card.label}</p>
          <p className="hero-score" style={{ margin: "4px 0 0", fontSize: 30 }}>{card.value}</p>
        </article>
      ))}
    </section>
  );
}

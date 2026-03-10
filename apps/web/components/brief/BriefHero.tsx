import type { DailyBriefData } from "../../lib/brief-api";

export function BriefHero({ data }: { data: DailyBriefData }) {
  return (
    <section className="card brief-hero">
      <p className="dashboard-mini-head">Daily Brief · {data.date}</p>
      <h2>{data.title}</h2>
      <p className="desc">{data.summary}</p>
      <div className="brief-hero-note">
        <strong>Focus guidance</strong>
        <p>{data.guidance}</p>
      </div>
    </section>
  );
}

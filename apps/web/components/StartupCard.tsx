import Link from "next/link";
import type { StartupRecord } from "../lib/types";
import ScoreBadge from "./ScoreBadge";

export default function StartupCard({ startup }: { startup: StartupRecord }) {
  return (
    <article className="card">
      <div className="card-top">
        <div>
          <h3>{startup.name}</h3>
          <p className="muted">{startup.location} � {startup.domain}</p>
        </div>
        <ScoreBadge score={startup.score} />
      </div>
      <p className="desc">{startup.description}</p>
      <div className="chip-row">
        {startup.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="chip">{tag}</span>
        ))}
      </div>
      <div className="row-end">
        <span className="muted">Hiring probability: {startup.intelligence.hiringProbability}%</span>
        <Link className="link-btn" href={`/startups/${startup.id}`}>View Detail</Link>
      </div>
    </article>
  );
}

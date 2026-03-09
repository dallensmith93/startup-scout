export default function RecommendedActionCard({ action, summary }: { action: string; summary: string }) {
  return (
    <article className="card">
      <h3>Recommended Action</h3>
      <p>{action}</p>
      <p className="muted">{summary}</p>
    </article>
  );
}

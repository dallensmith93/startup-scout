export default function ConfidenceMeter({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <article className="card">
      <h3>Confidence</h3>
      <div className="meter"><span style={{ width: `${pct}%` }} /></div>
      <p className="muted">{pct}% confidence based on available evidence.</p>
    </article>
  );
}

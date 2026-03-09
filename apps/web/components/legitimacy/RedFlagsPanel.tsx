export default function RedFlagsPanel({ items }: { items: string[] }) {
  return (
    <article className="card">
      <h3>Red Flags</h3>
      {items.length === 0 ? <p className="muted">No major red flags detected.</p> : <ul>{items.map((x) => <li key={x}>{x}</li>)}</ul>}
    </article>
  );
}

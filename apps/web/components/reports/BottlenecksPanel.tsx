export function BottlenecksPanel({ bottlenecks, title = "Bottlenecks" }: { bottlenecks: string[]; title?: string }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      <ul className="list-clean">{bottlenecks.map((b) => <li key={b}>{b}</li>)}</ul>
    </section>
  );
}

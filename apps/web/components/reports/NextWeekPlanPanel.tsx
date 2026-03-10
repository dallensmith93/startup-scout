export function NextWeekPlanPanel({ items, title = "Next Week Plan" }: { items: string[]; title?: string }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      <ol className="list-clean">{items.map((i) => <li key={i}>{i}</li>)}</ol>
    </section>
  );
}

export default function TrustSignalsPanel({ items }: { items: string[] }) {
  return (
    <article className="card">
      <h3>Trust Signals</h3>
      <ul>{items.map((x) => <li key={x}>{x}</li>)}</ul>
    </article>
  );
}

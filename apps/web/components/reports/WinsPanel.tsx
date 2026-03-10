export function WinsPanel({ wins }: { wins: string[] }) {
  return (
    <section className="card">
      <h3>Wins</h3>
      <ul className="list-clean">{wins.map((w) => <li key={w}>{w}</li>)}</ul>
    </section>
  );
}

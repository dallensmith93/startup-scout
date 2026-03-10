export default function NextStepCard({ nextStep }: { nextStep: string }) {
  return (
    <article className="card accent-card">
      <h3>Recommended Next Step</h3>
      <p>{nextStep}</p>
    </article>
  );
}

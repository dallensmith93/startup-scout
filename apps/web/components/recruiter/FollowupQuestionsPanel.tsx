export default function FollowupQuestionsPanel({ questions }: { questions: string[] }) {
  return (
    <article className="card">
      <h3>Suggested Follow-up Questions</h3>
      <ul>{questions.map((q) => <li key={q}>{q}</li>)}</ul>
    </article>
  );
}

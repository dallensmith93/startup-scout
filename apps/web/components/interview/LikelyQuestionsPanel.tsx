"use client";

type LikelyQuestionsPanelProps = {
  questions: string[];
};

async function copyText(value: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    // no-op
  }
}

export function LikelyQuestionsPanel({ questions }: LikelyQuestionsPanelProps) {
  return (
    <section className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>Likely Questions</h3>
        <button className="link-btn" onClick={() => void copyText(questions.map((p) => `- ${p}`).join("\n"))}>
          Copy
        </button>
      </div>
      <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
        {questions.map((question) => (
          <article key={question} style={{ border: "1px solid #2a4167", borderRadius: 10, padding: 10, background: "rgba(13,23,39,.75)" }}>
            {question}
          </article>
        ))}
      </div>
    </section>
  );
}


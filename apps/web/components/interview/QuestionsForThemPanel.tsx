"use client";

type QuestionsForThemPanelProps = {
  questions: string[];
};

async function copyText(value: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    // no-op
  }
}

export function QuestionsForThemPanel({ questions }: QuestionsForThemPanelProps) {
  return (
    <section className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>Questions To Ask Them</h3>
        <button className="link-btn" onClick={() => void copyText(questions.map((p) => `- ${p}`).join("\n"))}>
          Copy
        </button>
      </div>
      <ol style={{ margin: "10px 0 0", paddingLeft: 18, display: "grid", gap: 8 }}>
        {questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ol>
    </section>
  );
}


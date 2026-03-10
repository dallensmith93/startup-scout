"use client";

type IntroGeneratorPanelProps = {
  intro: string;
  summary: string;
};

async function copyText(value: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    // no-op
  }
}

export function IntroGeneratorPanel({ intro, summary }: IntroGeneratorPanelProps) {
  return (
    <section className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>Opening Paragraph</h3>
        <button className="link-btn" onClick={() => void copyText(intro)}>
          Copy Intro
        </button>
      </div>
      <p className="muted" style={{ marginBottom: 8 }}>
        {summary}
      </p>
      <div
        style={{
          border: "1px solid #2b4064",
          borderRadius: 12,
          padding: 12,
          background: "linear-gradient(150deg, rgba(19,34,57,.95), rgba(12,20,35,.8))"
        }}
      >
        <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.55 }}>{intro}</p>
      </div>
    </section>
  );
}

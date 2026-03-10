"use client";

type InterviewPrepCardProps = {
  pitch: string;
  source: string;
};

async function copyText(value: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    // no-op
  }
}

export function InterviewPrepCard({ pitch, source }: InterviewPrepCardProps) {
  return (
    <section className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>30-Second Pitch</h3>
        <span className="chip">{source}</span>
      </div>
      <p
        style={{
          marginBottom: 10,
          lineHeight: 1.55,
          border: "1px solid #2f4a74",
          borderRadius: 10,
          padding: 12,
          background: "rgba(19,35,58,.45)"
        }}
      >
        {pitch}
      </p>
      <button className="link-btn" onClick={() => void copyText(pitch)}>
        Copy Pitch
      </button>
    </section>
  );
}


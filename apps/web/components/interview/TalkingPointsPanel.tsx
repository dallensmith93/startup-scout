"use client";

type TalkingPointsPanelProps = {
  points: string[];
};

async function copyText(value: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    // no-op
  }
}

export function TalkingPointsPanel({ points }: TalkingPointsPanelProps) {
  return (
    <section className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>Talking Points</h3>
        <button className="link-btn" onClick={() => void copyText(points.map((p) => `- ${p}`).join("\n"))}>
          Copy
        </button>
      </div>
      <ul style={{ margin: "10px 0 0", paddingLeft: 18, display: "grid", gap: 8 }}>
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}


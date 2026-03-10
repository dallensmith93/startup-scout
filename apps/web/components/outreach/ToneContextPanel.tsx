import type { ToneContext } from "../../lib/outreach-api";

type ToneContextPanelProps = {
  tone: ToneContext;
};

export function ToneContextPanel({ tone }: ToneContextPanelProps) {
  return (
    <section className="card">
      <h3 style={{ marginTop: 0 }}>Tone Guardrails</h3>
      <p className="muted" style={{ marginTop: 6 }}>Voice: {tone.voice}</p>
      <div className="detail-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <h4 style={{ margin: "4px 0 8px" }}>Do</h4>
          <ul className="list-clean">
            {tone.doList.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h4 style={{ margin: "4px 0 8px" }}>Avoid</h4>
          <ul className="list-clean">
            {tone.avoidList.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

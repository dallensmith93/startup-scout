import type { NetworkContactDetail } from "../../lib/network-api";

type MessageHistoryPanelProps = {
  messages: NetworkContactDetail["messageHistory"];
};

export function MessageHistoryPanel({ messages }: MessageHistoryPanelProps) {
  return (
    <section className="card">
      <h4 style={{ marginTop: 0 }}>Message History</h4>
      <div className="network-message-list">
        {messages.length === 0 ? <p className="empty">No message history available.</p> : null}
        {messages.map((item, idx) => (
          <article key={`${item.date}-${idx}`} className="network-message-item">
            <div className="row-end">
              <strong>{item.channel}</strong>
              <span className="chip">{item.date}</span>
            </div>
            <p style={{ marginBottom: 6 }}>{item.summary}</p>
            <p className="muted" style={{ margin: 0 }}>Outcome: {item.outcome}</p>
            <p className="muted" style={{ margin: "6px 0 0" }}>Reason: {item.reason}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

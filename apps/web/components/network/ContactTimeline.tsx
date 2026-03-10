import type { NetworkContactDetail } from "../../lib/network-api";

type ContactTimelineProps = {
  timeline: NetworkContactDetail["timeline"];
};

export function ContactTimeline({ timeline }: ContactTimelineProps) {
  return (
    <section className="card">
      <h4 style={{ marginTop: 0 }}>Contact Timeline</h4>
      <div className="network-timeline">
        {timeline.length === 0 ? <p className="empty">No timeline events available.</p> : null}
        {timeline.map((item, idx) => (
          <article key={`${item.date}-${idx}`} className="network-timeline-item">
            <p className="muted">{item.date}</p>
            <h5>{item.title}</h5>
            <p>{item.detail}</p>
            <p className="muted">Reason: {item.reason}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

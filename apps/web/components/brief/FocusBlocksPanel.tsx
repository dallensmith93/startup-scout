import type { BriefFocusBlock, BriefPriority } from "../../lib/brief-api";

function priorityClass(priority: BriefPriority): string {
  if (priority === "critical") return "nudges-priority-high";
  if (priority === "high") return "nudges-priority-medium";
  return "nudges-priority-low";
}

export function FocusBlocksPanel({ blocks }: { blocks: BriefFocusBlock[] }) {
  if (blocks.length === 0) {
    return (
      <section className="card">
        <h3>Focus Blocks</h3>
        <p className="empty brief-empty">No focus blocks match this filter. Try `All blocks` to see the full plan.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="brief-section-head">
        <h3>Action Plan</h3>
        <p className="muted">Each block includes what to do now and why it matters.</p>
      </div>
      <div className="brief-block-list">
        {blocks.map((block) => (
          <article key={block.id} className="brief-block">
            <div className="brief-block-head">
              <strong>{block.title}</strong>
              <span className={`status-pill ${priorityClass(block.priority)}`}>{block.priority}</span>
            </div>
            <div className="chip-row">
              <span className="chip">{block.type}</span>
              <span className="chip">{block.minutes} min</span>
            </div>
            <p className="brief-inline-head">Action</p>
            <p>{block.action}</p>
            <p className="brief-inline-head">Reason</p>
            <p>{block.reason}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

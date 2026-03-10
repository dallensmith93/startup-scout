import { ConnectionBadge } from "./ConnectionBadge";
import type { Connection, ConnectionStage } from "../../lib/network-api";

type ConnectionStageColumnProps = {
  stage: ConnectionStage;
  stageLabel: string;
  items: Connection[];
  onSelect: (connection: Connection) => void;
  selectedId?: string;
};

export function ConnectionStageColumn({
  stage,
  stageLabel,
  items,
  onSelect,
  selectedId
}: ConnectionStageColumnProps) {
  return (
    <section className="card" style={{ padding: 12 }}>
      <div className="row-end" style={{ marginBottom: 10 }}>
        <h3 style={{ margin: 0 }}>{stageLabel}</h3>
        <span className="chip">{items.length}</span>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {items.length === 0 ? <p className="muted" style={{ margin: 0 }}>No contacts in {stage}.</p> : null}
        {items.map((contact) => (
          <button
            key={contact.id}
            type="button"
            onClick={() => onSelect(contact)}
            style={{
              textAlign: "left",
              borderRadius: 12,
              border: selectedId === contact.id ? "1px solid #6ddcff" : "1px solid #2a4168",
              background: selectedId === contact.id ? "rgba(13, 42, 72, 0.62)" : "rgba(12, 22, 40, 0.66)",
              padding: 10,
              color: "inherit",
              cursor: "pointer"
            }}
          >
            <div className="row-end">
              <strong>{contact.name}</strong>
              <span className="chip">{contact.company}</span>
            </div>
            <p className="muted" style={{ margin: "6px 0 0" }}>{contact.role}</p>
            <ConnectionBadge connection={contact} />
          </button>
        ))}
      </div>
    </section>
  );
}

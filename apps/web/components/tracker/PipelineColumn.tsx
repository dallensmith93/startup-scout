"use client";

import { type TrackerItem, type TrackerStatus } from "../../lib/tracker-api";
import { StatusPill } from "./StatusPill";

type PipelineColumnProps = {
  title: string;
  status: TrackerStatus;
  items: TrackerItem[];
  onMove: (id: string, direction: "prev" | "next") => void;
};

export function PipelineColumn({ title, status, items, onMove }: PipelineColumnProps) {
  return (
    <section
      className="card"
      style={{ minWidth: 320, background: "linear-gradient(165deg, rgba(17,28,46,.97), rgba(10,16,28,.92))" }}
    >
      <div className="row-end" style={{ marginBottom: 10 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span className="chip">{items.length}</span>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {items.length === 0 && <p className="empty">No applications in this stage.</p>}
        {items.map((item) => (
          <article
            key={item.id}
            style={{ border: "1px solid #243554", borderRadius: 12, background: "rgba(9,15,27,.85)", padding: 12 }}
          >
            <div className="row-end">
              <div>
                <strong>{item.company}</strong>
                <p className="muted" style={{ margin: "3px 0 0" }}>
                  {item.role}
                </p>
              </div>
              <StatusPill status={status} />
            </div>
            <div className="chip-row" style={{ marginTop: 9 }}>
              <span className="chip">{item.location}</span>
              <span className="chip">Due {item.dueDate}</span>
            </div>
            <p style={{ margin: "8px 0 10px" }}>{item.nextAction}</p>
            <div className="row-end">
              <button
                className="link-btn"
                type="button"
                onClick={() => onMove(item.id, "prev")}
                disabled={status === "saved"}
                style={{ padding: "6px 10px", background: "linear-gradient(135deg, #284567, #1d395c)" }}
              >
                Back
              </button>
              <button
                className="link-btn"
                type="button"
                onClick={() => onMove(item.id, "next")}
                disabled={status === "rejected" || status === "offer"}
                style={{ padding: "6px 10px" }}
              >
                Advance
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


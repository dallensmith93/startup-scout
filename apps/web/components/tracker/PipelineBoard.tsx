"use client";

import { type TrackerItem, type TrackerStatus } from "../../lib/tracker-api";
import { PipelineColumn } from "./PipelineColumn";

type PipelineBoardProps = {
  items: TrackerItem[];
  onMove: (id: string, direction: "prev" | "next") => void;
};

const order: TrackerStatus[] = ["saved", "applied", "interview", "offer", "rejected"];

const labels: Record<TrackerStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Closed"
};

export function PipelineBoard({ items, onMove }: PipelineBoardProps) {
  return (
    <section>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 6 }}>
        {order.map((status) => (
          <PipelineColumn
            key={status}
            title={labels[status]}
            status={status}
            items={items.filter((item) => item.status === status)}
            onMove={onMove}
          />
        ))}
      </div>
    </section>
  );
}


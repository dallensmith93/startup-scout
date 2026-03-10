"use client";

import { type TrackerItem } from "../../lib/tracker-api";

type FollowupReminderCardProps = {
  items: TrackerItem[];
};

function dueSoon(items: TrackerItem[]): TrackerItem[] {
  const now = Date.now();
  const cutoff = now + 1000 * 60 * 60 * 24 * 3;
  return items
    .filter((item) => item.status !== "rejected" && item.status !== "offer")
    .filter((item) => {
      const ts = Date.parse(item.dueDate);
      return Number.isFinite(ts) && ts <= cutoff;
    })
    .sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate));
}

async function copyText(value: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    // no-op
  }
}

export function FollowupReminderCard({ items }: FollowupReminderCardProps) {
  const reminders = dueSoon(items);
  const mailDraft = reminders
    .map((item) => `Subject: Follow-up on ${item.role} application\nHi team at ${item.company},\n\n${item.nextAction}\n\nBest,\n`)
    .join("\n---\n");

  return (
    <section className="card">
      <div className="row-end">
        <h3 style={{ margin: 0 }}>Follow-up Reminders</h3>
        <button className="link-btn" onClick={() => void copyText(mailDraft)} disabled={reminders.length === 0}>
          Copy Follow-up Drafts
        </button>
      </div>
      <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
        {reminders.length === 0 && <p className="empty">No urgent follow-ups in the next 3 days.</p>}
        {reminders.map((item) => (
          <div key={item.id} style={{ border: "1px solid #2a4167", borderRadius: 10, padding: 10, background: "rgba(22,37,62,.45)" }}>
            <strong>{item.company}</strong>
            <p className="muted" style={{ margin: "4px 0" }}>
              {item.role} | Due {item.dueDate}
            </p>
            <p style={{ margin: 0 }}>{item.nextAction}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


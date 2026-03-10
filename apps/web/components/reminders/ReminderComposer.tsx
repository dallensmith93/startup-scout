import { useState, type FormEvent } from "react";
import type { ReminderDraft, ReminderPriority } from "../../lib/reminders-api";

type ReminderComposerProps = {
  onAdd: (draft: ReminderDraft) => void;
};

const initialDraft: ReminderDraft = {
  title: "",
  context: "",
  dueDate: "",
  priority: "medium"
};

export function ReminderComposer({ onAdd }: ReminderComposerProps) {
  const [draft, setDraft] = useState<ReminderDraft>(initialDraft);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.dueDate) return;
    onAdd({
      title: draft.title.trim(),
      context: draft.context.trim(),
      dueDate: draft.dueDate,
      priority: draft.priority
    });
    setDraft(initialDraft);
  };

  return (
    <section className="card reminders-card">
      <h3 style={{ marginTop: 0 }}>Add Reminder</h3>
      <form className="reminders-form" onSubmit={handleSubmit}>
        <label>
          Reminder
          <input
            placeholder="Follow up with recruiter..."
            value={draft.title}
            onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
          />
        </label>
        <label>
          Context
          <textarea
            rows={3}
            placeholder="Optional notes to keep this reminder focused."
            value={draft.context}
            onChange={(event) => setDraft((prev) => ({ ...prev, context: event.target.value }))}
          />
        </label>
        <div className="reminders-row">
          <label>
            Due
            <input
              type="date"
              value={draft.dueDate}
              onChange={(event) => setDraft((prev) => ({ ...prev, dueDate: event.target.value }))}
            />
          </label>
          <label>
            Priority
            <select
              value={draft.priority}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, priority: event.target.value as ReminderPriority }))
              }
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>
        <button className="link-btn" type="submit">Add reminder</button>
      </form>
    </section>
  );
}

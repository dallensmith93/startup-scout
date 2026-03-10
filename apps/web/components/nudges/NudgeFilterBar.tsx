export function NudgeFilterBar({
  kind,
  priority,
  state,
  onKindChange,
  onPriorityChange,
  onStateChange
}: {
  kind: string;
  priority: string;
  state: string;
  onKindChange: (next: string) => void;
  onPriorityChange: (next: string) => void;
  onStateChange: (next: string) => void;
}) {
  return (
    <section className="toolbar-card nudges-filter">
      <label>
        Kind
        <select value={kind} onChange={(event) => onKindChange(event.target.value)}>
          <option value="all">All</option>
          <option value="timing">Timing</option>
          <option value="quality">Quality</option>
          <option value="risk">Risk</option>
          <option value="momentum">Momentum</option>
        </select>
      </label>
      <label>
        Priority
        <select value={priority} onChange={(event) => onPriorityChange(event.target.value)}>
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </label>
      <label>
        State
        <select value={state} onChange={(event) => onStateChange(event.target.value)}>
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="snoozed">Snoozed</option>
          <option value="done">Done</option>
        </select>
      </label>
    </section>
  );
}

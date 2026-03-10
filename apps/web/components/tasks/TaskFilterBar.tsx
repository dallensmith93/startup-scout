export function TaskFilterBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <section className="toolbar-card">
      <label>
        Filter tasks
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="follow-up">Follow-up</option>
          <option value="optimization">Optimization</option>
        </select>
      </label>
    </section>
  );
}

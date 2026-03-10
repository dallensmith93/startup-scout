export function BriefFilterBar({
  value,
  onChange
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <section className="toolbar-card brief-filter">
      <label>
        Filter focus blocks
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="all">All blocks</option>
          <option value="follow-up">Follow-up</option>
          <option value="deep-work">Deep work</option>
          <option value="quick-win">Quick win</option>
          <option value="prep">Prep</option>
        </select>
      </label>
    </section>
  );
}

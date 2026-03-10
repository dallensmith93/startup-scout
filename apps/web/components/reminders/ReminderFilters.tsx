type ReminderFilter = "all" | "today" | "upcoming" | "done";

type ReminderFiltersProps = {
  value: ReminderFilter;
  onChange: (next: ReminderFilter) => void;
  counts: Record<ReminderFilter, number>;
};

const filterLabels: Record<ReminderFilter, string> = {
  all: "All",
  today: "Today",
  upcoming: "Upcoming",
  done: "Done"
};

export type { ReminderFilter };

export function ReminderFilters({ value, onChange, counts }: ReminderFiltersProps) {
  return (
    <section className="card reminders-filters">
      {(Object.keys(filterLabels) as ReminderFilter[]).map((key) => (
        <button
          key={key}
          type="button"
          className={value === key ? "reminders-filter active" : "reminders-filter"}
          onClick={() => onChange(key)}
        >
          <span>{filterLabels[key]}</span>
          <strong>{counts[key] ?? 0}</strong>
        </button>
      ))}
    </section>
  );
}

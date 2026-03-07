export type FilterState = {
  minAiRelevance: number;
  minHiringUrgency: number;
  aiCategory: string;
  onlyWithApplyLink: boolean;
  maxFreshnessHours: number;
};

type Props = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
};

const CATEGORIES = ["all", "agent", "copilot", "automation", "developer-tool", "ml-system", "search-analysis", "general-ai"];

export default function FilterBar({ filters, onChange }: Props) {
  return (
    <section className="filter-bar">
      <label>
        Min AI
        <input
          type="range"
          min={0}
          max={100}
          value={filters.minAiRelevance}
          onChange={(e) => onChange({ ...filters, minAiRelevance: Number(e.target.value) })}
        />
        <span className="metric-pill">{filters.minAiRelevance}</span>
      </label>

      <label>
        Min Hiring
        <input
          type="range"
          min={0}
          max={100}
          value={filters.minHiringUrgency}
          onChange={(e) => onChange({ ...filters, minHiringUrgency: Number(e.target.value) })}
        />
        <span className="metric-pill">{filters.minHiringUrgency}</span>
      </label>

      <label>
        AI Category
        <select value={filters.aiCategory} onChange={(e) => onChange({ ...filters, aiCategory: e.target.value })}>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        Freshness Window
        <input
          type="range"
          min={1}
          max={48}
          value={filters.maxFreshnessHours}
          onChange={(e) => onChange({ ...filters, maxFreshnessHours: Number(e.target.value) })}
        />
        <span className="metric-pill">{filters.maxFreshnessHours}h</span>
      </label>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={filters.onlyWithApplyLink}
          onChange={(e) => onChange({ ...filters, onlyWithApplyLink: e.target.checked })}
        />
        Only with apply link
      </label>
    </section>
  );
}

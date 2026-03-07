import FilterBar, { type FilterState } from "../components/FilterBar";
import StartupCard from "../components/StartupCard";
import type { StartupRecord } from "../lib/api";

type Props = {
  items: StartupRecord[];
  filters: FilterState;
  onFilterChange: (next: FilterState) => void;
  loading: boolean;
};

function matchesFilters(item: StartupRecord, filters: FilterState): boolean {
  if (item.aiRelevanceScore < filters.minAiRelevance) return false;
  if (item.hiringUrgencyScore < filters.minHiringUrgency) return false;
  if (item.freshnessHours > filters.maxFreshnessHours) return false;
  if (filters.aiCategory !== "all" && item.aiCategory !== filters.aiCategory) return false;
  if (filters.onlyWithApplyLink && !(item.applyUrl || item.careersUrl || item.website)) return false;
  return true;
}

export default function Dashboard({ items, filters, onFilterChange, loading }: Props) {
  const filtered = items.filter((item) => matchesFilters(item, filters));

  return (
    <section>
      <FilterBar filters={filters} onChange={onFilterChange} />
      {loading && <p className="hint">Loading approved startups...</p>}
      {!loading && filtered.length === 0 && <p className="hint">No approved startups match the current filters.</p>}
      {filtered.map((startup) => (
        <StartupCard key={startup.id} startup={startup} />
      ))}
    </section>
  );
}

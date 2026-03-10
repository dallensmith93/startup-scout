import { useEffect, useMemo, useState } from "react";

export type ActivityCategory = "all" | "reminder" | "preference" | "system";

export type ActivityEvent = {
  id: string;
  occurredAt: string;
  category: Exclude<ActivityCategory, "all">;
  title: string;
  detail: string;
};

type ActivityTimelineProps = {
  events: ActivityEvent[];
};

const FILTER_STORAGE_KEY = "startup-scout.activity-filter.v1";

function formatDayLabel(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function formatTimeLabel(value: string) {
  const date = new Date(value);
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  const [filter, setFilter] = useState<ActivityCategory>("all");

  useEffect(() => {
    const stored = window.localStorage.getItem(FILTER_STORAGE_KEY) as ActivityCategory | null;
    if (stored === "all" || stored === "reminder" || stored === "preference" || stored === "system") {
      setFilter(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(FILTER_STORAGE_KEY, filter);
  }, [filter]);

  const filtered = useMemo(() => {
    if (filter === "all") return events;
    return events.filter((event) => event.category === filter);
  }, [events, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, ActivityEvent[]>();
    for (const event of filtered) {
      const day = event.occurredAt.slice(0, 10);
      if (!map.has(day)) map.set(day, []);
      map.get(day)?.push(event);
    }
    return [...map.entries()].map(([day, items]) => ({
      day,
      items: items.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    }));
  }, [filtered]);

  return (
    <section className="activity-wrap">
      <div className="card activity-filters">
        {(["all", "reminder", "preference", "system"] as ActivityCategory[]).map((key) => (
          <button
            key={key}
            type="button"
            className={filter === key ? "reminders-filter active" : "reminders-filter"}
            onClick={() => setFilter(key)}
          >
            {key === "all" ? "All activity" : key}
          </button>
        ))}
      </div>

      {!grouped.length ? <p className="empty">No activity yet for this filter.</p> : null}

      <div className="activity-day-stack">
        {grouped.map((group) => (
          <article key={group.day} className="card activity-day-card">
            <h3 className="activity-day-head">{formatDayLabel(group.day)}</h3>
            <div className="activity-events">
              {group.items.map((item) => (
                <div key={item.id} className="activity-item">
                  <div className="activity-meta">
                    <span>{formatTimeLabel(item.occurredAt)}</span>
                    <span className="chip">{item.category}</span>
                  </div>
                  <h4>{item.title}</h4>
                  <p className="muted">{item.detail}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

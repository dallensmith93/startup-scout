"use client";

import { useEffect, useMemo, useState } from "react";
import { ActivityTimeline, type ActivityEvent } from "../../components/activity/ActivityTimeline";
import { getUserPreferences } from "../../lib/preferences-api";
import { getReminders } from "../../lib/reminders-api";

const baseEvents: ActivityEvent[] = [
  {
    id: "sys-1",
    occurredAt: "2026-03-09T16:35:00.000Z",
    category: "system",
    title: "Weekly review generated",
    detail: "Pipeline health summary and bottlenecks were refreshed."
  },
  {
    id: "sys-2",
    occurredAt: "2026-03-08T11:10:00.000Z",
    category: "system",
    title: "Priority queue recalculated",
    detail: "Opportunity scores changed after new application signals."
  }
];

function reminderEvents(reminderData: Awaited<ReturnType<typeof getReminders>>): ActivityEvent[] {
  const items: ActivityEvent[] = [];
  for (const reminder of reminderData) {
    if (reminder.status === "done" && reminder.completedAt) {
      items.push({
        id: `rem-done-${reminder.id}`,
        occurredAt: reminder.completedAt,
        category: "reminder",
        title: `Completed: ${reminder.title}`,
        detail: reminder.context || "Reminder completed."
      });
      continue;
    }
    items.push({
      id: `rem-active-${reminder.id}`,
      occurredAt: `${reminder.dueDate}T08:00:00.000Z`,
      category: "reminder",
      title: `Reminder due: ${reminder.title}`,
      detail: reminder.context || "Reminder currently active."
    });
  }
  return items;
}

export default function ActivityFeedPage() {
  const [events, setEvents] = useState<ActivityEvent[] | null>(null);

  useEffect(() => {
    void Promise.all([getReminders(), getUserPreferences()]).then(([reminders, prefs]) => {
      const preferenceEvent: ActivityEvent = {
        id: "pref-current",
        occurredAt: prefs.updatedAt,
        category: "preference",
        title: `Nudge intensity: ${prefs.nudgeIntensity}`,
        detail: `Alerts: push ${prefs.alerts.browserPush ? "on" : "off"}, digest ${prefs.alerts.emailDigest ? "on" : "off"}, interview ${prefs.alerts.interviewDeadlines ? "on" : "off"}, follow-up ${prefs.alerts.followupEscalation ? "on" : "off"}.`
      };

      const timeline = [...baseEvents, ...reminderEvents(reminders), preferenceEvent]
        .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
      setEvents(timeline);
    });
  }, []);

  const recentCount = useMemo(() => {
    if (!events) return 0;
    return events.filter((item) => item.occurredAt >= "2026-03-01T00:00:00.000Z").length;
  }, [events]);

  if (!events) return <main><p className="empty">Loading activity feed...</p></main>;

  return (
    <main>
      <header className="page-head">
        <h2>Activity Feed</h2>
        <p className="muted">{recentCount} events since March 1, 2026.</p>
      </header>
      <ActivityTimeline events={events} />
    </main>
  );
}

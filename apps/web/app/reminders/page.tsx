"use client";

import { useEffect, useMemo, useState } from "react";
import { ReminderComposer } from "../../components/reminders/ReminderComposer";
import { ReminderFilters, type ReminderFilter } from "../../components/reminders/ReminderFilters";
import { ReminderList } from "../../components/reminders/ReminderList";
import {
  createReminderFromDraft,
  getReminders,
  saveReminders,
  type ReminderDraft,
  type ReminderItem
} from "../../lib/reminders-api";

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(isoDay: string, days: number) {
  const date = new Date(`${isoDay}T12:00:00`);
  date.setDate(date.getDate() + days);
  return localDateKey(date);
}

export default function RemindersPage() {
  const [items, setItems] = useState<ReminderItem[] | null>(null);
  const [filter, setFilter] = useState<ReminderFilter>("today");
  const todayKey = localDateKey(new Date());

  useEffect(() => {
    void getReminders().then(setItems);
  }, []);

  const persist = (next: ReminderItem[]) => {
    setItems(next);
    void saveReminders(next);
  };

  const counts = useMemo(() => {
    const list = items ?? [];
    return {
      all: list.length,
      today: list.filter((item) => item.status === "pending" && item.dueDate <= todayKey).length,
      upcoming: list.filter((item) => item.status === "pending" && item.dueDate > todayKey).length,
      done: list.filter((item) => item.status === "done").length
    };
  }, [items, todayKey]);

  const filtered = useMemo(() => {
    const list = items ?? [];
    if (filter === "all") return list;
    if (filter === "today") return list.filter((item) => item.status === "pending" && item.dueDate <= todayKey);
    if (filter === "upcoming") return list.filter((item) => item.status === "pending" && item.dueDate > todayKey);
    return list.filter((item) => item.status === "done");
  }, [filter, items, todayKey]);

  const handleAdd = (draft: ReminderDraft) => {
    const next = [createReminderFromDraft(draft), ...(items ?? [])];
    persist(next);
  };

  const handleToggleDone = (id: string) => {
    const next: ReminderItem[] = (items ?? []).map((item) => {
      if (item.id !== id) return item;
      const nextStatus: ReminderItem["status"] = item.status === "done" ? "pending" : "done";
      return {
        ...item,
        status: nextStatus,
        completedAt: nextStatus === "done" ? new Date().toISOString() : null
      };
    });
    persist(next);
  };

  const handleDelete = (id: string) => {
    const next = (items ?? []).filter((item) => item.id !== id);
    persist(next);
  };

  const handleSnooze = (id: string) => {
    const next = (items ?? []).map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        dueDate: addDays(item.dueDate, 1)
      };
    });
    persist(next);
  };

  if (!items) return <main><p className="empty">Loading reminders...</p></main>;

  return (
    <main className="reminders-page">
      <header className="page-head">
        <h2>Reminders</h2>
        <p className="muted">Focused reminders for follow-ups, prep, and deadlines.</p>
      </header>

      <div className="detail-grid">
        <ReminderComposer onAdd={handleAdd} />
        <section className="card reminders-summary">
          <h3 style={{ marginTop: 0 }}>At a Glance</h3>
          <div className="reminders-count-grid">
            <div><span>Due now</span><strong>{counts.today}</strong></div>
            <div><span>Upcoming</span><strong>{counts.upcoming}</strong></div>
            <div><span>Completed</span><strong>{counts.done}</strong></div>
          </div>
        </section>
      </div>

      <div style={{ marginTop: 14 }}>
        <ReminderFilters value={filter} onChange={setFilter} counts={counts} />
      </div>
      <div style={{ marginTop: 14 }}>
        <ReminderList
          items={filtered}
          onToggleDone={handleToggleDone}
          onDelete={handleDelete}
          onSnooze={handleSnooze}
        />
      </div>
    </main>
  );
}

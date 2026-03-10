"use client";

import { useEffect, useMemo, useState } from "react";
import { FollowupReminderCard } from "../../components/tracker/FollowupReminderCard";
import { PipelineBoard } from "../../components/tracker/PipelineBoard";
import { getTrackerItems, persistTrackerItems, type TrackerItem, type TrackerStatus } from "../../lib/tracker-api";

const STORAGE_KEY = "phase4.tracker.items";
const ORDER: TrackerStatus[] = ["saved", "applied", "interview", "offer", "rejected"];

const blankForm = {
  company: "",
  role: "",
  location: "Remote",
  dueDate: "2026-03-14",
  nextAction: ""
};

export default function TrackerPage() {
  const [items, setItems] = useState<TrackerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(blankForm);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setItems(JSON.parse(raw) as TrackerItem[]);
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    void getTrackerItems().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      void persistTrackerItems(items);
    }
  }, [items, loading]);

  const stats = useMemo(() => {
    return ORDER.map((status) => ({ status, count: items.filter((item) => item.status === status).length }));
  }, [items]);

  const moveItem = (id: string, direction: "prev" | "next") => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }
        const index = ORDER.indexOf(item.status);
        const nextIndex = direction === "next" ? Math.min(index + 1, ORDER.length - 1) : Math.max(index - 1, 0);
        return {
          ...item,
          status: ORDER[nextIndex],
          updatedAt: new Date().toISOString().slice(0, 10)
        };
      })
    );
  };

  const addItem = () => {
    if (!form.company.trim() || !form.role.trim()) {
      return;
    }
    const next: TrackerItem = {
      id: `trk-${Date.now()}`,
      company: form.company.trim(),
      role: form.role.trim(),
      status: "saved",
      location: form.location.trim() || "Remote",
      dueDate: form.dueDate,
      nextAction: form.nextAction.trim() || "Prepare and submit tailored application.",
      notes: "",
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    setItems((prev) => [next, ...prev]);
    setForm(blankForm);
  };

  return (
    <main>
      <header className="page-head">
        <div>
          <h2>Application Tracker</h2>
          <p className="muted">Move opportunities through a clean pipeline and never miss a follow-up.</p>
        </div>
      </header>
      <section className="toolbar-card">
        <div className="chip-row">
          {stats.map((entry) => (
            <span key={entry.status} className="chip">
              {entry.status}: {entry.count}
            </span>
          ))}
        </div>
        <div className="detail-grid">
          <label>
            Company
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
          </label>
          <label>
            Role
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role title" />
          </label>
        </div>
        <div className="detail-grid">
          <label>
            Location
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Remote / city" />
          </label>
          <label>
            Due date
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </label>
        </div>
        <label>
          Next action
          <input value={form.nextAction} onChange={(e) => setForm({ ...form, nextAction: e.target.value })} placeholder="Follow-up / prep task" />
        </label>
        <div className="row-end">
          <span className="muted">Saved locally and synced to the API when available.</span>
          <button className="link-btn" type="button" onClick={addItem}>
            Add Opportunity
          </button>
        </div>
      </section>
      {loading ? (
        <p className="empty">Loading tracker...</p>
      ) : (
        <>
          <PipelineBoard items={items} onMove={moveItem} />
          <div style={{ marginTop: 14 }}>
            <FollowupReminderCard items={items} />
          </div>
        </>
      )}
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { ActionQueuePanel } from "../../components/tasks/ActionQueuePanel";
import { DueSoonPanel } from "../../components/tasks/DueSoonPanel";
import { TaskFilterBar } from "../../components/tasks/TaskFilterBar";
import { TaskList } from "../../components/tasks/TaskList";
import { getTaskData, type TaskData } from "../../lib/task-api";

export default function TasksPage() {
  const [data, setData] = useState<TaskData | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    void getTaskData().then(setData);
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data.items;
    return data.items.filter((item) => item.priority === filter || item.category === filter);
  }, [data, filter]);

  if (!data) return <main><p className="empty">Loading tasks...</p></main>;

  return (
    <main>
      <header className="page-head"><h2>Task Queue</h2><p className="muted">Action queue generated from current pipeline bottlenecks.</p></header>
      <TaskFilterBar value={filter} onChange={setFilter} />
      <div className="detail-grid detail-grid-wide">
        <ActionQueuePanel
          items={data.actionQueue.map((item) => ({
            id: item.id,
            title: item.title,
            category: "action-queue",
            priority: item.urgency === "critical" || item.urgency === "high" ? "high" : "medium",
            dueDate: item.dueDate,
            linkedApplicationId: item.linkedApplicationId,
            reason: item.reason,
          }))}
        />
        <DueSoonPanel items={data.followups} />
      </div>
      <section className="card" style={{ marginTop: 14 }}>
        <h3>Queue Rationale</h3>
        <p style={{ marginBottom: 0 }}>{data.reason}</p>
      </section>
      <div style={{ marginTop: 14 }}><TaskList items={filtered} /></div>
    </main>
  );
}

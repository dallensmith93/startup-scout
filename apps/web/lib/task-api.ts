export type TaskItem = {
  id: string;
  title: string;
  category: string;
  priority: string;
  dueDate: string;
  linkedApplicationId?: string | null;
  reason: string;
};

export type FollowupItem = {
  applicationId: string;
  startupName: string;
  roleTitle: string;
  dueDate: string;
  reason: string;
};

export type ActionQueueItem = {
  id: string;
  title: string;
  urgency: string;
  dueDate: string;
  linkedApplicationId?: string | null;
  reason: string;
};

export type TaskData = { items: TaskItem[]; followups: FollowupItem[]; actionQueue: ActionQueueItem[]; reason: string };

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getTaskData(): Promise<TaskData> {
  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, "")}/tasks`, { cache: "no-store" });
    if (res.ok) return (await res.json()) as TaskData;
  } catch {
    // fallback below
  }

  return {
    items: [
      {
        id: "task-followup-1",
        title: "Send follow-up to Delta Platform",
        category: "follow-up",
        priority: "high",
        dueDate: "2026-03-10",
        linkedApplicationId: "app_delta_platform",
        reason: "Follow-up stage requires immediate touchpoint."
      }
    ],
    followups: [
      {
        applicationId: "app_delta_platform",
        startupName: "Delta Platform",
        roleTitle: "Platform Engineer",
        dueDate: "2026-03-10",
        reason: "No recent update and still active in pipeline."
      }
    ],
    actionQueue: [
      {
        id: "action-1",
        title: "Follow up with Delta Platform",
        urgency: "high",
        dueDate: "2026-03-10",
        linkedApplicationId: "app_delta_platform",
        reason: "No recent touchpoint and role remains active."
      }
    ],
    reason: "Fallback task response."
  };
}

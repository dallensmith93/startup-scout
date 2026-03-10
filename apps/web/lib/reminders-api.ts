export type ReminderPriority = "high" | "medium" | "low";
export type ReminderStatus = "pending" | "done";

export type ReminderItem = {
  id: string;
  title: string;
  context: string;
  dueDate: string;
  priority: ReminderPriority;
  status: ReminderStatus;
  createdAt: string;
  completedAt?: string | null;
};

export type ReminderDraft = {
  title: string;
  context: string;
  dueDate: string;
  priority: ReminderPriority;
};

const STORAGE_KEY = "startup-scout.reminders.v1";

const fallbackReminders: ReminderItem[] = [
  {
    id: "rem-1",
    title: "Follow up with Northstar Labs recruiter",
    context: "No reply since first screen request.",
    dueDate: "2026-03-10",
    priority: "high",
    status: "pending",
    createdAt: "2026-03-08T14:30:00.000Z"
  },
  {
    id: "rem-2",
    title: "Send tailored resume for Flux Health",
    context: "Backend role requires healthcare domain bullets.",
    dueDate: "2026-03-12",
    priority: "medium",
    status: "pending",
    createdAt: "2026-03-08T15:00:00.000Z"
  },
  {
    id: "rem-3",
    title: "Review interview notes for Arclight AI",
    context: "Prep story for distributed systems deep dive.",
    dueDate: "2026-03-09",
    priority: "low",
    status: "done",
    createdAt: "2026-03-07T17:20:00.000Z",
    completedAt: "2026-03-08T22:10:00.000Z"
  }
];

function isClient() {
  return typeof window !== "undefined";
}

function sortReminders(items: ReminderItem[]) {
  const priorityRank: Record<ReminderPriority, number> = { high: 0, medium: 1, low: 2 };
  return [...items].sort((a, b) => {
    if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
    const dateDiff = a.dueDate.localeCompare(b.dueDate);
    if (dateDiff !== 0) return dateDiff;
    return priorityRank[a.priority] - priorityRank[b.priority];
  });
}

function readStoredReminders(): ReminderItem[] | null {
  if (!isClient()) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ReminderItem[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getReminders(): Promise<ReminderItem[]> {
  const stored = readStoredReminders();
  if (stored?.length) return sortReminders(stored);
  return sortReminders(fallbackReminders);
}

export async function saveReminders(items: ReminderItem[]): Promise<void> {
  if (!isClient()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sortReminders(items)));
}

export function createReminderFromDraft(draft: ReminderDraft): ReminderItem {
  return {
    id: `rem-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    title: draft.title.trim(),
    context: draft.context.trim(),
    dueDate: draft.dueDate,
    priority: draft.priority,
    status: "pending",
    createdAt: new Date().toISOString(),
    completedAt: null
  };
}

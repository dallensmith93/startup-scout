export type NudgeIntensity = "light" | "balanced" | "intense";

export type AlertPreferences = {
  browserPush: boolean;
  emailDigest: boolean;
  interviewDeadlines: boolean;
  followupEscalation: boolean;
};

export type UserPreferences = {
  nudgeIntensity: NudgeIntensity;
  alerts: AlertPreferences;
  updatedAt: string;
};

const STORAGE_KEY = "startup-scout.preferences.v1";

const defaultPreferences: UserPreferences = {
  nudgeIntensity: "balanced",
  alerts: {
    browserPush: true,
    emailDigest: false,
    interviewDeadlines: true,
    followupEscalation: true
  },
  updatedAt: "2026-03-09T16:00:00.000Z"
};

function isClient() {
  return typeof window !== "undefined";
}

function mergePreferences(raw: Partial<UserPreferences>): UserPreferences {
  return {
    nudgeIntensity: raw.nudgeIntensity ?? defaultPreferences.nudgeIntensity,
    alerts: {
      browserPush: raw.alerts?.browserPush ?? defaultPreferences.alerts.browserPush,
      emailDigest: raw.alerts?.emailDigest ?? defaultPreferences.alerts.emailDigest,
      interviewDeadlines: raw.alerts?.interviewDeadlines ?? defaultPreferences.alerts.interviewDeadlines,
      followupEscalation: raw.alerts?.followupEscalation ?? defaultPreferences.alerts.followupEscalation
    },
    updatedAt: raw.updatedAt ?? defaultPreferences.updatedAt
  };
}

export async function getUserPreferences(): Promise<UserPreferences> {
  if (!isClient()) return defaultPreferences;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultPreferences;
  try {
    return mergePreferences(JSON.parse(raw) as Partial<UserPreferences>);
  } catch {
    return defaultPreferences;
  }
}

export async function saveUserPreferences(next: UserPreferences): Promise<UserPreferences> {
  const saved: UserPreferences = { ...next, updatedAt: new Date().toISOString() };
  if (isClient()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }
  return saved;
}

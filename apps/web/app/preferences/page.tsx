"use client";

import { useEffect, useMemo, useState } from "react";
import { PreferencesForm } from "../../components/preferences/PreferencesForm";
import { getUserPreferences, saveUserPreferences, type UserPreferences } from "../../lib/preferences-api";

export default function PreferencesPage() {
  const [initial, setInitial] = useState<UserPreferences | null>(null);
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getUserPreferences().then((loaded) => {
      setInitial(loaded);
      setPrefs(loaded);
    });
  }, []);

  const dirty = useMemo(() => {
    if (!initial || !prefs) return false;
    return JSON.stringify({
      nudgeIntensity: prefs.nudgeIntensity,
      alerts: prefs.alerts
    }) !== JSON.stringify({
      nudgeIntensity: initial.nudgeIntensity,
      alerts: initial.alerts
    });
  }, [initial, prefs]);

  const handleSave = async () => {
    if (!prefs || saving) return;
    setSaving(true);
    const saved = await saveUserPreferences(prefs);
    setPrefs(saved);
    setInitial(saved);
    setSaving(false);
  };

  if (!prefs) return <main><p className="empty">Loading preferences...</p></main>;

  return (
    <main>
      <header className="page-head">
        <h2>Preferences</h2>
        <p className="muted">Set reminder intensity and choose the alert channels you actually want.</p>
      </header>
      <PreferencesForm
        value={prefs}
        onChange={(next) => setPrefs(next)}
        onSave={handleSave}
        saving={saving}
        dirty={dirty}
      />
      <p className="muted" style={{ marginTop: 12 }}>
        Last updated: {new Date(prefs.updatedAt).toLocaleString()}
      </p>
    </main>
  );
}

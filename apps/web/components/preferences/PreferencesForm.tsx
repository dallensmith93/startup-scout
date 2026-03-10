import type { NudgeIntensity, UserPreferences } from "../../lib/preferences-api";

type PreferencesFormProps = {
  value: UserPreferences;
  onChange: (next: UserPreferences) => void;
  onSave: () => void;
  saving: boolean;
  dirty: boolean;
};

const intensityOptions: { value: NudgeIntensity; label: string; description: string }[] = [
  { value: "light", label: "Light", description: "A gentle cadence with fewer prompts." },
  { value: "balanced", label: "Balanced", description: "Smart defaults for most weeks." },
  { value: "intense", label: "Intense", description: "Frequent nudges when momentum is crucial." }
];

export function PreferencesForm({ value, onChange, onSave, saving, dirty }: PreferencesFormProps) {
  return (
    <section className="preferences-grid">
      <article className="card">
        <h3 style={{ marginTop: 0 }}>Nudge Intensity</h3>
        <p className="muted">Control how often Startup Scout pushes reminders and action prompts.</p>
        <div className="preferences-intensity">
          {intensityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={value.nudgeIntensity === option.value ? "preferences-intensity-btn active" : "preferences-intensity-btn"}
              onClick={() => onChange({ ...value, nudgeIntensity: option.value })}
            >
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>
      </article>

      <article className="card">
        <h3 style={{ marginTop: 0 }}>Alert Toggles</h3>
        <p className="muted">Turn channels on or off to fit your attention budget.</p>
        <div className="preferences-toggles">
          <label className="preferences-toggle-row">
            <span>Browser push alerts</span>
            <input
              type="checkbox"
              checked={value.alerts.browserPush}
              onChange={(event) =>
                onChange({ ...value, alerts: { ...value.alerts, browserPush: event.target.checked } })
              }
            />
          </label>
          <label className="preferences-toggle-row">
            <span>Email digest</span>
            <input
              type="checkbox"
              checked={value.alerts.emailDigest}
              onChange={(event) =>
                onChange({ ...value, alerts: { ...value.alerts, emailDigest: event.target.checked } })
              }
            />
          </label>
          <label className="preferences-toggle-row">
            <span>Interview deadline alerts</span>
            <input
              type="checkbox"
              checked={value.alerts.interviewDeadlines}
              onChange={(event) =>
                onChange({ ...value, alerts: { ...value.alerts, interviewDeadlines: event.target.checked } })
              }
            />
          </label>
          <label className="preferences-toggle-row">
            <span>Follow-up escalation alerts</span>
            <input
              type="checkbox"
              checked={value.alerts.followupEscalation}
              onChange={(event) =>
                onChange({ ...value, alerts: { ...value.alerts, followupEscalation: event.target.checked } })
              }
            />
          </label>
        </div>
      </article>

      <article className="card preferences-save-row">
        <div>
          <h3 style={{ margin: 0 }}>Save Preferences</h3>
          <p className="muted" style={{ marginBottom: 0 }}>
            {dirty ? "You have unsaved changes." : "Preferences are up to date."}
          </p>
        </div>
        <button className="link-btn" type="button" onClick={onSave} disabled={saving || !dirty}>
          {saving ? "Saving..." : "Save settings"}
        </button>
      </article>
    </section>
  );
}

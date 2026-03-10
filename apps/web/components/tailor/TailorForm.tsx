"use client";

import { type TailorInput } from "../../lib/tailoring-api";

type TailorFormProps = {
  input: TailorInput;
  onChange: (next: TailorInput) => void;
  onSubmit: () => void;
  loading: boolean;
};

const sampleInput: TailorInput = {
  jobTitle: "Growth Product Manager",
  company: "Helix Labs",
  jobDescription:
    "Own growth experiments across activation and retention. Collaborate with design, data, and recruiting. Must be strong in SQL, metric narratives, and stakeholder communication.",
  resumeText:
    "Led lifecycle optimization initiatives, designed onboarding tests, and improved 30-day retention by 11%. Built Looker dashboards, performed weekly SQL analysis, and presented insights to cross-functional leadership.",
  tone: "concise",
  introPrompt: "Confident and specific with measurable outcomes."
};

export function TailorForm({ input, onChange, onSubmit, loading }: TailorFormProps) {
  const setField = <K extends keyof TailorInput>(key: K, value: TailorInput[K]) => {
    onChange({ ...input, [key]: value });
  };

  return (
    <form
      className="form-grid"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="detail-grid">
        <label>
          Job title
          <input value={input.jobTitle} onChange={(e) => setField("jobTitle", e.target.value)} placeholder="Role title" />
        </label>
        <label>
          Company
          <input value={input.company} onChange={(e) => setField("company", e.target.value)} placeholder="Target company" />
        </label>
      </div>
      <label>
        Job description
        <textarea
          rows={7}
          value={input.jobDescription}
          onChange={(e) => setField("jobDescription", e.target.value)}
          placeholder="Paste job description..."
        />
      </label>
      <label>
        Resume text
        <textarea
          rows={7}
          value={input.resumeText}
          onChange={(e) => setField("resumeText", e.target.value)}
          placeholder="Paste current bullets / summary..."
        />
      </label>
      <div className="detail-grid">
        <label>
          Tone
          <select value={input.tone} onChange={(e) => setField("tone", e.target.value as TailorInput["tone"])}>
            <option value="impact">Impact-heavy</option>
            <option value="concise">Concise</option>
          </select>
        </label>
        <label>
          Intro style prompt
          <input
            value={input.introPrompt}
            onChange={(e) => setField("introPrompt", e.target.value)}
            placeholder="Optional style guidance"
          />
        </label>
      </div>
      <div className="row-end">
        <button
          type="button"
          className="link-btn"
          onClick={() => onChange(sampleInput)}
          style={{ background: "linear-gradient(135deg, #1f3f6f, #1d617e)" }}
        >
          Use Sample
        </button>
        <button type="submit" className="link-btn" disabled={loading}>
          {loading ? "Generating..." : "Generate Tailored Brief"}
        </button>
      </div>
    </form>
  );
}

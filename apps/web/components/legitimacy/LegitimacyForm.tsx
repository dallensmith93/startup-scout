"use client";

import type { LegitimacyInput } from "../../lib/legitimacy-types";

export default function LegitimacyForm({ value, onChange, onSubmit, loading }: {
  value: LegitimacyInput;
  onChange: (next: LegitimacyInput) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <section className="card form-grid">
      <h3>Job Legitimacy Inputs</h3>
      <label>Job title<input value={value.jobTitle} onChange={(e) => onChange({ ...value, jobTitle: e.target.value })} /></label>
      <label>Company name<input value={value.companyName} onChange={(e) => onChange({ ...value, companyName: e.target.value })} /></label>
      <label>Salary range<input value={value.salaryRange || ""} onChange={(e) => onChange({ ...value, salaryRange: e.target.value })} /></label>
      <label>Posting URL<input value={value.postingUrl || ""} onChange={(e) => onChange({ ...value, postingUrl: e.target.value })} /></label>
      <label>Company website<input value={value.companyWebsite || ""} onChange={(e) => onChange({ ...value, companyWebsite: e.target.value })} /></label>
      <label>Recruiter message<textarea rows={4} value={value.recruiterMessage || ""} onChange={(e) => onChange({ ...value, recruiterMessage: e.target.value })} /></label>
      <label>Job description<textarea rows={7} value={value.jobDescription} onChange={(e) => onChange({ ...value, jobDescription: e.target.value })} /></label>
      <label>Notes<textarea rows={3} value={value.notes || ""} onChange={(e) => onChange({ ...value, notes: e.target.value })} /></label>
      <button className="link-btn" onClick={onSubmit} disabled={loading || !value.jobTitle || !value.companyName || !value.jobDescription}>
        {loading ? "Analyzing..." : "Analyze Legitimacy"}
      </button>
    </section>
  );
}

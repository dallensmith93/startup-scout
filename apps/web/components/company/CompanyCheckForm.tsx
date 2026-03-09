"use client";

import type { CompanyCheckInput } from "../../lib/legitimacy-types";

export default function CompanyCheckForm({ value, onChange, onSubmit }: {
  value: CompanyCheckInput;
  onChange: (next: CompanyCheckInput) => void;
  onSubmit: () => void;
}) {
  return (
    <article className="card form-grid">
      <h3>Company Credibility Check</h3>
      <label>Company name<input value={value.companyName} onChange={(e) => onChange({ ...value, companyName: e.target.value })} /></label>
      <label>Website<input value={value.website} onChange={(e) => onChange({ ...value, website: e.target.value })} /></label>
      <label>Domain<input value={value.domain} onChange={(e) => onChange({ ...value, domain: e.target.value })} /></label>
      <label>Posting URL<input value={value.postingUrl || ""} onChange={(e) => onChange({ ...value, postingUrl: e.target.value })} /></label>
      <button className="link-btn" onClick={onSubmit}>Analyze Company</button>
    </article>
  );
}

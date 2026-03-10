import type { ApplicationFitResult } from "../../lib/application-types";

export default function TailoredAssetsPanel({ result }: { result: ApplicationFitResult }) {
  return (
    <article className="card">
      <h3>Tailored Assets</h3>
      <p>{result.tailoredIntroParagraph}</p>
      <h4>Resume Bullet Suggestions</h4>
      <ul className="list-clean">
        {result.tailoredResumeBullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <h4>Keyword Gap</h4>
      <p className="muted">Overlap score: {result.keywordGapReport.overlapScore}%</p>
      <div className="chip-row">
        {result.keywordGapReport.matchedKeywords.map((item) => (
          <span className="chip chip-good" key={`m-${item}`}>{item}</span>
        ))}
        {result.keywordGapReport.missingKeywords.map((item) => (
          <span className="chip chip-warn" key={`g-${item}`}>{item}</span>
        ))}
      </div>
      <p><strong>Strongest relevant experience:</strong> {result.strongestRelevantExperience}</p>
    </article>
  );
}

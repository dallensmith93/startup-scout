import Link from "next/link";

import type { ApplicationRecord } from "../../lib/application-types";

export default function ApplicationCard({ application }: { application: ApplicationRecord }) {
  return (
    <article className="card app-card">
      <div className="card-top">
        <div>
          <h3>{application.startupName}</h3>
          <p className="muted">{application.roleTitle}</p>
        </div>
        <span className={`status-pill ${application.status}`}>{application.status}</span>
      </div>
      <p className="desc">{application.roleSummary}</p>
      <div className="chip-row">
        {application.requiredSkills.slice(0, 4).map((skill) => (
          <span className="chip" key={skill}>{skill}</span>
        ))}
      </div>
      <div className="row-end">
        <span className="muted">{application.location}</span>
        <Link className="link-btn" href={`/applications/${application.id}`}>
          Open Workspace
        </Link>
      </div>
    </article>
  );
}

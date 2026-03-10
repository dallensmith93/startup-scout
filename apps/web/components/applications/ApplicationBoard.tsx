import ApplicationCard from "./ApplicationCard";

import type { ApplicationRecord } from "../../lib/application-types";

export default function ApplicationBoard({ items }: { items: ApplicationRecord[] }) {
  if (items.length === 0) {
    return <p className="empty">No applications yet. Add opportunities from discovery to start your pipeline.</p>;
  }

  return (
    <section className="grid">
      {items.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </section>
  );
}

import type { Connection, WarmPath } from "../../lib/network-api";

type ContactRecommendationListProps = {
  paths: WarmPath[];
  contacts: Connection[];
};

export function ContactRecommendationList({ paths, contacts }: ContactRecommendationListProps) {
  const contactMap = new Map(contacts.map((contact) => [contact.id, contact]));
  const recommendations = paths.flatMap((path) =>
    path.recommendedContactIds.map((contactId) => ({ path, contact: contactMap.get(contactId) }))
  );

  if (!recommendations.length) return <p className="empty">No contact recommendations yet.</p>;

  return (
    <section className="card">
      <h3 style={{ marginTop: 0 }}>Recommended Contacts</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {recommendations.map(({ path, contact }) => {
          if (!contact) return null;
          return (
            <article key={`${path.id}-${contact.id}`} style={{ border: "1px solid #2a4168", borderRadius: 10, padding: 10 }}>
              <div className="row-end">
                <strong>{contact.name}</strong>
                <span className="chip">{path.targetCompany}</span>
              </div>
              <p className="muted" style={{ marginTop: 6 }}>{contact.role} | {contact.company}</p>
              <p style={{ margin: "8px 0 0" }}>{contact.nextAction}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

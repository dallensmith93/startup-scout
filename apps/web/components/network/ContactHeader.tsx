import Link from "next/link";
import type { Connection } from "../../lib/network-api";

type ContactHeaderProps = {
  contact: Connection;
};

export function ContactHeader({ contact }: ContactHeaderProps) {
  return (
    <header className="contact-header">
      <div>
        <h3>{contact.name}</h3>
        <p>
          {contact.role} at {contact.company}
        </p>
      </div>
      <div className="contact-header-actions">
        <span className="chip">{contact.stage}</span>
        <Link className="link-btn" href={`/network/${contact.id}`}>
          Open Detail
        </Link>
      </div>
    </header>
  );
}

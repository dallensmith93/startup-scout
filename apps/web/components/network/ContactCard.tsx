import type { Connection } from "../../lib/network-api";
import { ContactHeader } from "./ContactHeader";
import { RelationshipStrengthMeter } from "./RelationshipStrengthMeter";

type ContactCardProps = {
  contact: Connection;
  selected?: boolean;
  onSelect?: (contact: Connection) => void;
};

export function ContactCard({ contact, selected = false, onSelect }: ContactCardProps) {
  return (
    <article className={selected ? "card network-card-selected" : "card network-card"}>
      <ContactHeader contact={contact} />
      <p className="muted" style={{ marginTop: 8 }}>{contact.notes}</p>
      <div className="chip-row">
        <span className="chip">Reply {contact.responseLikelihood}%</span>
        <span className="chip">Warm Path {contact.warmPathScore}%</span>
        <span className="chip">Last touch {contact.lastTouchDays}d</span>
      </div>
      <p style={{ marginBottom: 6 }}><strong>Next:</strong> {contact.nextAction}</p>
      <p className="muted" style={{ marginTop: 0 }}>{contact.nextActionReason}</p>
      <RelationshipStrengthMeter score={contact.relationshipStrength} reason={contact.relationshipReason} />
      {onSelect ? (
        <button type="button" className="link-btn" onClick={() => onSelect(contact)}>
          {selected ? "Selected" : "Focus Contact"}
        </button>
      ) : null}
    </article>
  );
}

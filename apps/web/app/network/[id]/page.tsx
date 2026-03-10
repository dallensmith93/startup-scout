"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ContactHeader } from "../../../components/network/ContactHeader";
import { ContactTimeline } from "../../../components/network/ContactTimeline";
import { MessageHistoryPanel } from "../../../components/network/MessageHistoryPanel";
import { NextActionPanel } from "../../../components/network/NextActionPanel";
import { RelationshipStrengthMeter } from "../../../components/network/RelationshipStrengthMeter";
import { SpotlightHero } from "../../../components/shared/SpotlightHero";
import { SplitViewLayout } from "../../../components/shared/SplitViewLayout";
import { getNetworkContactById, type NetworkContactDetail } from "../../../lib/network-api";

export default function NetworkContactDetailPage() {
  const params = useParams<{ id: string }>();
  const [detail, setDetail] = useState<NetworkContactDetail | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    void getNetworkContactById(params.id).then(setDetail);
  }, [params?.id]);

  const firstName = useMemo(() => (detail ? detail.contact.name.split(" ")[0] : "Contact"), [detail]);

  if (!detail) {
    return (
      <main>
        <p className="empty">Loading contact detail...</p>
      </main>
    );
  }

  return (
    <main className="network-detail-page">
      <SpotlightHero
        eyebrow="Contact Intelligence"
        title={`${detail.contact.name} | ${detail.contact.company}`}
        subtitle={detail.reason}
        metrics={[
          { label: "Strength", value: detail.contact.relationshipStrength },
          { label: "Reply Likelihood", value: `${detail.contact.responseLikelihood}%` },
          { label: "Last Touch", value: `${detail.contact.lastTouchDays}d` }
        ]}
        actions={<Link href="/network" className="link-btn">Back to Network</Link>}
      />

      <section className="card" style={{ marginTop: 14 }}>
        <ContactHeader contact={detail.contact} />
        <p className="muted" style={{ marginTop: 8 }}>{detail.contact.notes}</p>
      </section>

      <SplitViewLayout
        main={
          <div className="network-detail-stack">
            <RelationshipStrengthMeter score={detail.contact.relationshipStrength} reason={detail.contact.relationshipReason} />
            <ContactTimeline timeline={detail.timeline} />
            <MessageHistoryPanel messages={detail.messageHistory} />
          </div>
        }
        side={
          <div className="network-detail-stack">
            <NextActionPanel action={detail.contact.nextAction} reason={detail.contact.nextActionReason} />
            <section className="card">
              <h4 style={{ marginTop: 0 }}>Suggested Message Starter</h4>
              <p>
                Hi {firstName}, quick update on my progress for the {detail.contact.role} scope. Would you be open to a short next-step recommendation this week?
              </p>
            </section>
          </div>
        }
      />
    </main>
  );
}

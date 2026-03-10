"use client";

import { useEffect, useMemo, useState } from "react";
import { ContactCard } from "../../components/network/ContactCard";
import { FloatingActionRail } from "../../components/shared/FloatingActionRail";
import { GradientStatCard } from "../../components/shared/GradientStatCard";
import { SpotlightHero } from "../../components/shared/SpotlightHero";
import { SplitViewLayout } from "../../components/shared/SplitViewLayout";
import { getNetworkData, type Connection, type NetworkData } from "../../lib/network-api";

export default function NetworkPage() {
  const [data, setData] = useState<NetworkData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    void getNetworkData().then((payload) => {
      setData(payload);
      setSelectedId(payload.connections[0]?.id ?? null);
    });
  }, []);

  const selectedContact = useMemo(() => {
    if (!data || !selectedId) return null;
    return data.connections.find((item) => item.id === selectedId) ?? data.connections[0] ?? null;
  }, [data, selectedId]);

  if (!data) {
    return (
      <main>
        <p className="empty">Loading network intelligence...</p>
      </main>
    );
  }

  const strong = data.connections.filter((item) => item.relationshipStrength >= 75).length;
  const active = data.connections.filter((item) => item.stage === "active").length;
  const warming = data.connections.filter((item) => item.stage === "warm").length;

  return (
    <main className="network-page">
      <SpotlightHero
        eyebrow="Phase 7"
        title="Network Intelligence"
        subtitle={data.focus}
        metrics={[
          { label: "Total Contacts", value: data.connections.length },
          { label: "Strong Ties", value: strong },
          { label: "Warm Paths", value: data.warmPaths.length }
        ]}
      />

      <div className="network-stats-grid">
        <GradientStatCard label="Active" value={active} detail="Contacts already in motion this week." />
        <GradientStatCard label="Warm" value={warming} detail="Priority group for referral asks." />
        <GradientStatCard
          label="Avg Strength"
          value={Math.round(data.connections.reduce((sum, item) => sum + item.relationshipStrength, 0) / Math.max(1, data.connections.length))}
          detail="Deterministic score from stage and recency." 
        />
      </div>

      <SplitViewLayout
        main={
          <section className="network-list-grid">
            {data.connections.map((contact: Connection) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                selected={selectedId === contact.id}
                onSelect={(item) => setSelectedId(item.id)}
              />
            ))}
          </section>
        }
        side={
          selectedContact ? (
            <FloatingActionRail
              title="Contact Focus"
              actions={[
                { label: `Open ${selectedContact.name.split(" ")[0]} Detail`, href: `/network/${selectedContact.id}` },
                { label: "Go to Connections Board", href: "/connections" },
                { label: "Open Outreach Hub", href: "/outreach-hub" },
                { label: "View Warm Paths", href: "/warm-paths" }
              ]}
            />
          ) : (
            <p className="empty">No contact selected.</p>
          )
        }
      />
    </main>
  );
}

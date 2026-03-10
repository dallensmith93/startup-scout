"use client";

import { useEffect, useState } from "react";
import { FollowupDraftCard } from "../../components/outreach/FollowupDraftCard";
import { MessageComposer } from "../../components/outreach/MessageComposer";
import { OutreachHubHero } from "../../components/outreach/OutreachHubHero";
import { ReferralAskCard } from "../../components/outreach/ReferralAskCard";
import { ToneContextPanel } from "../../components/outreach/ToneContextPanel";
import { getOutreachHubData, type OutreachHubData } from "../../lib/outreach-api";

export default function OutreachHubPage() {
  const [data, setData] = useState<OutreachHubData | null>(null);

  useEffect(() => {
    void getOutreachHubData().then(setData);
  }, []);

  if (!data) return <main><p className="empty">Loading outreach hub...</p></main>;

  return (
    <main>
      <header className="page-head">
        <h2>Outreach Hub</h2>
        <p className="muted">Generated {new Date(data.generatedAt).toLocaleString()}</p>
      </header>
      <OutreachHubHero
        weeklyTarget={data.weeklyTarget}
        sentThisWeek={data.sentThisWeek}
        responseRate={data.responseRate}
      />
      <div className="detail-grid" style={{ marginTop: 14 }}>
        <MessageComposer templates={data.templates} />
        <ToneContextPanel tone={data.toneContext} />
      </div>
      <section style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Follow-up drafts</h3>
        <div className="grid">
          {data.followups.map((item) => <FollowupDraftCard key={item.id} item={item} />)}
        </div>
      </section>
      <section style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Referral asks</h3>
        <div className="grid">
          {data.referralAsks.map((item) => <ReferralAskCard key={item.id} item={item} />)}
        </div>
      </section>
    </main>
  );
}

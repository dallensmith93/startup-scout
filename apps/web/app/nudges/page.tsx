"use client";

import { useEffect, useMemo, useState } from "react";
import { NudgeFilterBar } from "../../components/nudges/NudgeFilterBar";
import { NudgeList } from "../../components/nudges/NudgeList";
import { NudgesHero } from "../../components/nudges/NudgesHero";
import { getNudgeData, type NudgeData } from "../../lib/nudge-api";

export default function NudgesPage() {
  const [data, setData] = useState<NudgeData | null>(null);
  const [kind, setKind] = useState("all");
  const [priority, setPriority] = useState("all");
  const [state, setState] = useState("all");

  useEffect(() => {
    void getNudgeData().then(setData);
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.items.filter((item) => {
      if (kind !== "all" && item.kind !== kind) return false;
      if (priority !== "all" && item.priority !== priority) return false;
      if (state !== "all" && item.state !== state) return false;
      return true;
    });
  }, [data, kind, priority, state]);

  if (!data) return <main><p className="empty">Loading nudges...</p></main>;

  return (
    <main className="nudges-page">
      <header className="page-head">
        <h2>Nudges</h2>
        <p className="muted">Prompted next steps with clear impact and reasoning.</p>
      </header>
      <NudgesHero summary={data.summary} />
      <NudgeFilterBar
        kind={kind}
        priority={priority}
        state={state}
        onKindChange={setKind}
        onPriorityChange={setPriority}
        onStateChange={setState}
      />
      <NudgeList items={filtered} />
      <section className="card" style={{ marginTop: 14 }}>
        <h3>Data note</h3>
        <p>{data.reason}</p>
      </section>
    </main>
  );
}

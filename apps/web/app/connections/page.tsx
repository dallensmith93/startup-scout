"use client";

import { useEffect, useMemo, useState } from "react";
import { ConnectionsBoard } from "../../components/connections/ConnectionsBoard";
import { ContactQuickView } from "../../components/connections/ContactQuickView";
import { getNetworkData, type Connection, type NetworkData } from "../../lib/network-api";

export default function ConnectionsPage() {
  const [data, setData] = useState<NetworkData | null>(null);
  const [selected, setSelected] = useState<Connection | null>(null);

  useEffect(() => {
    void getNetworkData().then((payload) => {
      setData(payload);
      setSelected(payload.connections[0] ?? null);
    });
  }, []);

  const stats = useMemo(() => {
    const list = data?.connections ?? [];
    return {
      total: list.length,
      active: list.filter((item) => item.stage === "active").length,
      warm: list.filter((item) => item.stage === "warm").length
    };
  }, [data]);

  if (!data) return <main><p className="empty">Loading connections...</p></main>;

  return (
    <main>
      <header className="page-head">
        <div>
          <h2>Connections</h2>
          <p className="muted" style={{ marginTop: 6 }}>{data.focus}</p>
        </div>
        <div className="chip-row" style={{ marginBottom: 0 }}>
          <span className="chip">Total {stats.total}</span>
          <span className="chip">Active {stats.active}</span>
          <span className="chip">Warm {stats.warm}</span>
        </div>
      </header>
      <ConnectionsBoard connections={data.connections} selectedId={selected?.id} onSelect={setSelected} />
      <div style={{ marginTop: 14 }}>
        <ContactQuickView contact={selected} />
      </div>
    </main>
  );
}

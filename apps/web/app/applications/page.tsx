"use client";

import { useEffect, useState } from "react";

import ApplicationBoard from "../../components/applications/ApplicationBoard";
import ApplicationHeader from "../../components/applications/ApplicationHeader";
import { applicationsApi } from "../../lib/applications-api";
import type { ApplicationRecord } from "../../lib/application-types";

export default function ApplicationsPage() {
  const [items, setItems] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationsApi.list().then(setItems).finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <ApplicationHeader />
      {loading && <p className="empty">Loading application workspace...</p>}
      {!loading && <ApplicationBoard items={items} />}
    </main>
  );
}

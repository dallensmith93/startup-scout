"use client";

import { useEffect, useMemo, useState } from "react";
import { ContactRecommendationList } from "../../components/warm-paths/ContactRecommendationList";
import { IntroLikelihoodCard } from "../../components/warm-paths/IntroLikelihoodCard";
import { WarmPathCard } from "../../components/warm-paths/WarmPathCard";
import { WarmPathScorePanel } from "../../components/warm-paths/WarmPathScorePanel";
import { getNetworkData, type NetworkData } from "../../lib/network-api";

export default function WarmPathsPage() {
  const [data, setData] = useState<NetworkData | null>(null);

  useEffect(() => {
    void getNetworkData().then(setData);
  }, []);

  const topLikelihood = useMemo(() => {
    if (!data?.warmPaths.length) return 0;
    return Math.max(...data.warmPaths.map((item) => item.introLikelihood));
  }, [data]);

  if (!data) return <main><p className="empty">Loading warm paths...</p></main>;

  return (
    <main>
      <header className="page-head">
        <h2>Warm Paths</h2>
        <p className="muted">Prioritize introductions with the highest probability of conversion.</p>
      </header>
      <div className="detail-grid">
        <IntroLikelihoodCard score={topLikelihood} />
        <WarmPathScorePanel items={data.warmPaths} />
      </div>
      <div style={{ marginTop: 14 }}>
        <ContactRecommendationList paths={data.warmPaths} contacts={data.connections} />
      </div>
      <section style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Copy-ready intro drafts</h3>
        <div className="grid">
          {data.warmPaths.map((item) => <WarmPathCard key={item.id} item={item} />)}
        </div>
      </section>
    </main>
  );
}

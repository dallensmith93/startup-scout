import type { ReactNode } from "react";
import { GlassPanel } from "./GlassPanel";

type SpotlightMetric = {
  label: string;
  value: string | number;
};

type SpotlightHeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  metrics?: SpotlightMetric[];
  actions?: ReactNode;
};

export function SpotlightHero({ eyebrow, title, subtitle, metrics = [], actions }: SpotlightHeroProps) {
  return (
    <GlassPanel className="spotlight-hero">
      <p className="spotlight-eyebrow">{eyebrow}</p>
      <h2 className="spotlight-title">{title}</h2>
      <p className="spotlight-subtitle">{subtitle}</p>
      {metrics.length ? (
        <div className="spotlight-metrics">
          {metrics.map((metric) => (
            <div key={metric.label} className="spotlight-metric">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>
      ) : null}
      {actions ? <div className="spotlight-actions">{actions}</div> : null}
    </GlassPanel>
  );
}

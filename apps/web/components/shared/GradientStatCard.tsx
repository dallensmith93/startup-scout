import { GlassPanel } from "./GlassPanel";

type GradientStatCardProps = {
  label: string;
  value: string | number;
  detail: string;
};

export function GradientStatCard({ label, value, detail }: GradientStatCardProps) {
  return (
    <GlassPanel className="gradient-stat-card">
      <p className="gradient-stat-label">{label}</p>
      <p className="gradient-stat-value">{value}</p>
      <p className="gradient-stat-detail">{detail}</p>
    </GlassPanel>
  );
}

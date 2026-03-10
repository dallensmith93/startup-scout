import type { ReactNode } from "react";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
};

export function GlassPanel({ children, className = "" }: GlassPanelProps) {
  const classes = className ? `glass-panel ${className}` : "glass-panel";
  return <section className={classes}>{children}</section>;
}

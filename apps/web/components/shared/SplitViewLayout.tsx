import type { ReactNode } from "react";

type SplitViewLayoutProps = {
  main: ReactNode;
  side: ReactNode;
};

export function SplitViewLayout({ main, side }: SplitViewLayoutProps) {
  return (
    <div className="split-view-layout">
      <div>{main}</div>
      <div className="split-view-side">{side}</div>
    </div>
  );
}

import Link from "next/link";

type RailAction = {
  label: string;
  href: string;
};

type FloatingActionRailProps = {
  title?: string;
  actions: RailAction[];
};

export function FloatingActionRail({ title = "Quick Actions", actions }: FloatingActionRailProps) {
  return (
    <aside className="floating-action-rail">
      <p className="floating-action-title">{title}</p>
      <div className="floating-action-list">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="floating-action-link">
            {action.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}

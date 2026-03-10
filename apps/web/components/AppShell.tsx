"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";
import type { StartupFeedStatus } from "../lib/types";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Command Center" },
  { href: "/daily-brief", label: "Daily Brief" },
  { href: "/nudges", label: "Nudges" },
  { href: "/planner", label: "Planner" },
  { href: "/analytics", label: "Analytics" },
  { href: "/tasks", label: "Tasks" },
  { href: "/priorities", label: "Priorities" },
  { href: "/reports/weekly", label: "Weekly Review" },
  { href: "/network", label: "Network" },
  { href: "/connections", label: "Connections" },
  { href: "/outreach-hub", label: "Outreach Hub" },
  { href: "/warm-paths", label: "Warm Paths" },
  { href: "/relationship-health", label: "Relationship Health" },
  { href: "/discover", label: "Discover" },
  { href: "/rankings", label: "Rankings" },
  { href: "/applications", label: "Applications" },
  { href: "/tailor", label: "Tailor" },
  { href: "/tracker", label: "Tracker" },
  { href: "/interview-prep", label: "Interview Prep" },
  { href: "/outreach", label: "Outreach" },
  { href: "/hidden-startups", label: "Hidden Startups" },
  { href: "/resume-match", label: "Resume Match" },
  { href: "/legitimacy", label: "Job Legitimacy" },
  { href: "/recruiter-check", label: "Recruiter Check" },
  { href: "/company-check", label: "Company Check" }
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [feed, setFeed] = useState<StartupFeedStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.startupsMeta().then((status) => {
      if (!cancelled) setFeed(status);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const isLiveOn = Boolean(feed?.isLiveJobsEnabled || feed?.isLiveStartupsEnabled);

  return (
    <div className="shell">
      <aside className="sidebar">
        <h1>Startup Scout</h1>
        <p className="muted">Job Search Command Center</p>
        <div className="feed-chip-wrap" title={feed?.reason ?? "Checking live data status..."}>
          <span className={isLiveOn ? "feed-chip on" : "feed-chip off"}>
            Live Data {isLiveOn ? "ON" : "OFF"}
          </span>
          {feed ? (
            <p className="feed-chip-meta">
              Startups {feed.liveStartupCount} | Job Matches {feed.liveJobCompanyCount}
            </p>
          ) : (
            <p className="feed-chip-meta">Status check in progress...</p>
          )}
        </div>
        <nav>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? "nav-link active" : "nav-link"}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="content">{children}</section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/discover", label: "Discover" },
  { href: "/rankings", label: "Rankings" },
  { href: "/outreach", label: "Outreach" },
  { href: "/hidden-startups", label: "Hidden Startups" },
  { href: "/resume-match", label: "Resume Match" },
  { href: "/legitimacy", label: "Job Legitimacy" },
  { href: "/recruiter-check", label: "Recruiter Check" },
  { href: "/company-check", label: "Company Check" }
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="shell">
      <aside className="sidebar">
        <h1>Startup Scout</h1>
        <p className="muted">Phase 3 Legitimacy Intelligence</p>
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

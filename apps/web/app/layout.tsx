import type { Metadata } from "next";
import "./globals.css";
import AppShell from "../components/AppShell";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Startup Scout Command Center",
  description: "Personal job search command center for momentum, priorities, planning, analytics, and weekly reviews"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

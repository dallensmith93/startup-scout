import type { Metadata } from "next";
import "./globals.css";
import AppShell from "../components/AppShell";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Startup Scout Phase 3",
  description: "Startup intelligence platform with job legitimacy risk analysis"
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

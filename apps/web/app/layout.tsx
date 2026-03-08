import type { Metadata } from "next";
import "./globals.css";
import AppShell from "../components/AppShell";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Startup Scout Phase 2",
  description: "AI-powered startup intelligence for job seekers"
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

import type { Metadata } from "next";

import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content";
import { Navbar } from "@/components/home/navbar";
import { SiteFooter } from "@/components/home/site-footer";

export const metadata: Metadata = {
  title: "Dashboard — MIGO",
  description:
    "Track approved hackathons, upcoming launches, and your next mission in MIGO.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <Navbar />
      <DashboardPageContent />

      <SiteFooter />
    </div>
  );
}

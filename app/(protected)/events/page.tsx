import type { Metadata } from "next";

import { EventsPageContent } from "@/components/events/events-page-content";
import { Navbar } from "@/components/home/navbar";
import { SiteFooter } from "@/components/home/site-footer";

export const metadata: Metadata = {
  title: "Events — MIGO",
  description:
    "Browse hackathon events on MIGO. Review organizers, dates, themes, and registration status.",
};

export default function EventsDashboardPage() {
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <Navbar />
      <EventsPageContent />

      <SiteFooter />
    </div>
  );
}

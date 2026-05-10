import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EventApprovalHero } from "@/components/events/event-approval-hero";
import { Navbar } from "@/components/home/navbar";
import { SiteFooter } from "@/components/home/site-footer";
import {
  getHackathonEventById,
  mockHackathonEvents,
} from "@/data/mock-events";

type EventDetailsPageProps = {
  params: Promise<{ eventId: string }>;
};

export async function generateStaticParams() {
  return mockHackathonEvents.map((event) => ({
    eventId: event.id,
  }));
}

export async function generateMetadata({
  params,
}: EventDetailsPageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = getHackathonEventById(eventId);

  if (!event) {
    return {
      title: "Event not found — MIGO",
    };
  }

  return {
    title: `${event.title} — MIGO`,
    description: event.description,
  };
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </dt>
      <dd className="text-sm font-medium leading-snug text-zinc-100">{value}</dd>
    </div>
  );
}

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const { eventId } = await params;
  const event = getHackathonEventById(eventId);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <Navbar />

      <main>
        <section
          className="relative overflow-hidden border-b border-zinc-800/80"
          aria-labelledby="event-title"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.14),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <nav
              className="mb-8 text-sm text-zinc-500"
              aria-label="Breadcrumb"
            >
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href="/events"
                    className="rounded-md font-medium text-emerald-400/90 outline-none transition hover:text-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                  >
                    Events
                  </Link>
                </li>
                <li aria-hidden className="text-zinc-600">
                  /
                </li>
                <li className="font-medium text-zinc-300">Details</li>
              </ol>
            </nav>

            <EventApprovalHero event={event} />
          </div>
        </section>

        <section
          className="px-4 py-10 sm:px-6 sm:py-14"
          aria-label="Hackathon overview"
        >
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_320px] lg:gap-12 xl:grid-cols-[1fr_360px]">
            <div className="space-y-10">
              <article className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-white">
                  About this hackathon
                </h2>
                <p className="mt-4 text-base leading-relaxed text-zinc-300">
                  {event.description}
                </p>
              </article>

              <article className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-white">Rules</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Quick guardrails so teams know what success looks like.
                </p>
                <ul className="mt-6 space-y-4">
                  {event.rules.map((rule) => (
                    <li
                      key={rule}
                      className="flex gap-3 text-sm leading-relaxed text-zinc-300"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"
                        aria-hidden
                      />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-lg shadow-black/20">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  At a glance
                </h2>
                <dl className="mt-5 grid gap-3">
                  <InfoRow label="Date" value={event.date} />
                  <InfoRow label="Location" value={event.location} />
                  <InfoRow label="Team size" value={event.teamSize} />
                  <InfoRow label="Theme" value={event.theme} />
                </dl>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

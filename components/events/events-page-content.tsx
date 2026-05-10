"use client";

import { EventCard } from "@/components/events/event-card";
import { useEventContext } from "@/context/event-context";

export function EventsPageContent() {
  const { events } = useEventContext();

  return (
    <main>
      <section
        className="relative overflow-hidden border-b border-zinc-800/80 px-4 py-12 sm:px-6 sm:py-16"
        aria-labelledby="events-dashboard-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-400/90">
            Organizer dashboard
          </p>
          <h1
            id="events-dashboard-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Hackathon events
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
            Review submissions, check capacity, and green-light events before they
            go live to students across campus.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-zinc-500">
            <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1">
              {events.length} events
            </span>
            <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1">
              Mock data · demo UI
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14" aria-label="Event listings">
        <div className="mx-auto max-w-6xl">
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <li key={event.id}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}


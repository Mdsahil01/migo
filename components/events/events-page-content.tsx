 "use client";

import { useEffect, useState } from "react";

import { EventCard } from "@/components/events/event-card";

import { supabase } from "@/lib/supabase";

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  starts_at: string;
  status: string;
};

export function EventsPageContent() {
  const [events, setEvents] =
    useState<Event[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchEvents =
      async () => {
        const { data } =
          await supabase
            .from("events")
            .select("*")
            .order("starts_at", {
              ascending: true,
            });

        setEvents(data || []);

        setLoading(false);
      };

    fetchEvents();
  }, []);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-zinc-800/80 px-4 py-12 sm:px-6 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-400/90">
            Mission Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Active Missions
          </h1>

          <p className="mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
            Review missions, coordinate
            operations, and manage
            approved events across the
            MIGO ecosystem.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-zinc-500">
            <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1">
              {events.length} missions
            </span>

            <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1">
              Live Supabase Data
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <p className="text-zinc-500">
              Loading missions...
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <li key={event.id}>
                  <EventCard
  event={{
    id: event.id,
    title: event.title,
    description:
      event.description || "",
    location:
      event.location || "",
    date: new Date(
      event.starts_at,
    ).toLocaleDateString(),
    organizer: "MIGO",
    theme: "Mission",
    teamSize: "Flexible",
    startsAtIso:
      event.starts_at,
    rules: [],
  } as any}
/>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
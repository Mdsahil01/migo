"use client";

import { useCallback, useEffect, useState } from "react";

import { EventCard } from "@/components/events/event-card";

import { getEventSummary } from "@/lib/events/description";
import type { EventRecord } from "@/lib/events/types";
import { supabase } from "@/lib/supabase";

type FetchDevfolioResponse = {
  inserted: number;
  skippedDuplicates: number;
  errors?: string[];
};

export function EventsPageContent() {
  const [events, setEvents] =
    useState<EventRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [fetching, setFetching] =
    useState(false);

  const loadEvents = useCallback(
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
    },
    [],
  );

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const handleFetchLatestEvents =
    async () => {
      try {
        setFetching(true);

        const response = await fetch(
          "/api/fetch-devfolio-events",
          { method: "POST" },
        );

        const result =
          (await response.json()) as FetchDevfolioResponse & {
            error?: string;
          };

        if (!response.ok) {
          const message =
            result.errors?.length
              ? result.errors.join("\n")
              : result.error ||
                "Failed to fetch latest events.";

          alert(message);
          return;
        }

        alert(
          `Inserted: ${result.inserted}\nSkipped duplicates: ${result.skippedDuplicates}`,
        );

        window.location.reload();
      } catch {
        alert(
          "Something went wrong while fetching latest events.",
        );
      } finally {
        setFetching(false);
      }
    };

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

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1">
              {events.length} missions
            </span>

            <span className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1">
              Live Supabase Data
            </span>

            <button
              type="button"
              onClick={
                handleFetchLatestEvents
              }
              disabled={
                fetching
              }
              className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {fetching
                ? "Fetching..."
                : "Fetch Latest Events"}
            </button>
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
      getEventSummary(event),
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
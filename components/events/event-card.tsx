import type { HackathonEvent } from "@/data/mock-events";
import Link from "next/link";

import { EventStatusBadge } from "@/components/events/event-status-badge";

type EventCardProps = {
  event: HackathonEvent;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl shadow-black/30 transition hover:-translate-y-0.5 hover:border-emerald-500/25 hover:bg-zinc-900/80 hover:shadow-emerald-500/5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold leading-snug text-white transition group-hover:text-emerald-50">
          {event.title}
        </h2>
        <EventStatusBadge status={event.registrationStatus} />
      </div>

      <p className="mt-2 text-sm text-zinc-400">
        <span className="text-zinc-500">Organizer</span>{" "}
        <span className="font-medium text-zinc-300">{event.organizer}</span>
      </p>

      <dl className="mt-5 grid gap-3 text-sm">
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 text-zinc-500">Date</dt>
          <dd className="font-medium text-zinc-200">{event.date}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 text-zinc-500">Location</dt>
          <dd className="font-medium text-zinc-200">{event.location}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 text-zinc-500">Team size</dt>
          <dd className="font-medium text-zinc-200">{event.teamSize}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 text-zinc-500">Theme</dt>
          <dd className="font-medium text-zinc-200">{event.theme}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <Link
          href={`/events/${event.id}`}
          className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-600 bg-zinc-950/40 px-4 py-2.5 text-sm font-semibold text-zinc-100 outline-none transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500/50"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

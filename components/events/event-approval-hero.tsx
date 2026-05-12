"use client";

import type { HackathonEvent } from "@/data/mock-events";

import { EventDetailActions } from "@/components/events/event-detail-actions";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { useEventContext } from "@/context/event-context";

type EventApprovalHeroProps = {
  eventId: string;
  fallbackEvent: HackathonEvent;
};

const pendingReviewBadge = {
  label: "Pending Review",
  className:
    "border-amber-500/35 bg-amber-500/10 text-amber-200 ring-amber-500/20",
};

const approvedBadge = {
  label: "Approved",
  className:
    "border-emerald-500/35 bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
};

export function EventApprovalHero({ eventId, fallbackEvent }: EventApprovalHeroProps) {
  const { getEventById, approveEvent, markAddedToCalendar } = useEventContext();
  const event = getEventById(eventId) ?? fallbackEvent;
  const approved = event.approved;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400/90">
            Hackathon review
          </p>
          <EventStatusBadge custom={approved ? approvedBadge : pendingReviewBadge} />
        </div>
        <h1
          id="event-title"
          className="mt-3 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.65rem] lg:leading-tight"
        >
          {event.title}
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          <span className="text-zinc-500">Organizer</span>{" "}
          <span className="font-semibold text-zinc-200">{event.organizer}</span>
        </p>
      </div>

      <div className="w-full shrink-0 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-xl shadow-black/30 lg:max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Actions
        </p>
        <p className="mt-2 text-sm text-zinc-400">
          Approve when the brief looks good, or pull the dates into your
          calendar.
        </p>
        <div className="mt-5">
          <EventDetailActions
            event={event}
            approved={approved}
            onApprove={async () => {
              approveEvent(event.id);
            
              await fetch("/api/discord", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  title: event.title,
                  date: event.date,
                  location: event.location,
                  relevance: 4,
                  link: "https://migo-teams.vercel.app/events",
                }),
              });
            }}
            initialAddedToCalendar={event.addedToCalendar}
            onCalendarAdded={() => markAddedToCalendar(event.id)}
          />
        </div>
      </div>
    </div>
  );
}


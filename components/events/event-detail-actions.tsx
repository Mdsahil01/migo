"use client";

import type { HackathonEvent } from "@/data/mock-events";
import { useCallback, useState } from "react";

type EventDetailActionsProps = {
  event: HackathonEvent;
  approved?: boolean;
  onApprove?: () => void;
  initialAddedToCalendar?: boolean;
  onCalendarAdded?: () => void;
};

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function formatIcsUtc(dateIso: string) {
  const d = new Date(dateIso);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function buildIcsCalendar(event: HackathonEvent) {
  const stamp = formatIcsUtc(new Date().toISOString());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "PRODID:-//MIGO//Hackathon//EN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:h${event.id}@migo.app`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${formatIcsUtc(event.startsAtIso)}`,
    `DTEND:${formatIcsUtc(event.endsAtIso)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    `DESCRIPTION:${escapeIcsText(`${event.organizer}\n\n${event.description}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

export function EventDetailActions({
  event,
  approved = false,
  onApprove,
  initialAddedToCalendar = false,
  onCalendarAdded,
}: EventDetailActionsProps) {
  const [addedToCalendar, setAddedToCalendar] = useState(initialAddedToCalendar);

  const onAddToCalendar = useCallback(() => {
    const blob = new Blob([buildIcsCalendar(event)], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${event.title.replace(/\s+/g, "-").toLowerCase()}-migo.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
    setAddedToCalendar(true);
    onCalendarAdded?.();
  }, [event, onCalendarAdded]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={onApprove}
          disabled={approved || !onApprove}
          className="inline-flex flex-1 min-w-[9rem] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/25 outline-none transition hover:bg-emerald-400 hover:shadow-emerald-500/40 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:bg-emerald-500/60 disabled:text-zinc-200 disabled:shadow-none disabled:hover:bg-emerald-500/60"
        >
          {approved ? "Approved" : "Approve event"}
        </button>
        <button
          type="button"
          onClick={onAddToCalendar}
          disabled={addedToCalendar}
          className={`inline-flex flex-1 min-w-[9rem] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold outline-none transition focus-visible:ring-2 ${
            addedToCalendar
              ? "bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/25 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-80"
              : "border border-zinc-600 bg-zinc-950/40 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800 hover:text-white focus-visible:ring-emerald-500/50"
          }`}
        >
          <svg
            className={`h-4 w-4 shrink-0 ${addedToCalendar ? "text-zinc-900" : "text-zinc-400"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5"
            />
          </svg>
          {addedToCalendar ? "Added" : "Add To Calendar"}
        </button>
      </div>
      {addedToCalendar ? (
        <p className="mt-3 text-xs font-medium text-emerald-300">
          Event added to calendar
        </p>
      ) : null}
    </div>
  );
}

"use client";

import type { HackathonEvent } from "@/data/mock-events";
import { useCallback } from "react";

type EventDetailActionsProps = {
  event: HackathonEvent;
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

export function EventDetailActions({ event }: EventDetailActionsProps) {
  const onApprove = () => {
    window.alert(
      `"${event.title}" marked as approved in this demo. Wire this button to your API when you're ready.`,
    );
  };

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
  }, [event]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        onClick={onApprove}
        className="inline-flex flex-1 min-w-[9rem] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/25 outline-none transition hover:bg-emerald-400 hover:shadow-emerald-500/40 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      >
        Approve event
      </button>
      <button
        type="button"
        onClick={onAddToCalendar}
        className="inline-flex flex-1 min-w-[9rem] items-center justify-center gap-2 rounded-xl border border-zinc-600 bg-zinc-950/40 px-5 py-3 text-sm font-semibold text-zinc-100 outline-none transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500/50"
      >
        <svg
          className="h-4 w-4 shrink-0 text-zinc-400"
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
        Add to Calendar
      </button>
    </div>
  );
}

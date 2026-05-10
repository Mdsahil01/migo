import type { HackathonEvent, RegistrationStatus } from "@/data/mock-events";

const statusStyles: Record<
  RegistrationStatus,
  { className: string; label: string }
> = {
  Open: {
    className:
      "border-emerald-500/35 bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
    label: "Open",
  },
  "Closing soon": {
    className:
      "border-amber-500/35 bg-amber-500/10 text-amber-200 ring-amber-500/20",
    label: "Closing soon",
  },
  Waitlist: {
    className:
      "border-violet-500/35 bg-violet-500/10 text-violet-200 ring-violet-500/20",
    label: "Waitlist",
  },
  Closed: {
    className: "border-zinc-600 bg-zinc-800/80 text-zinc-400 ring-zinc-600/40",
    label: "Closed",
  },
  "Early bird": {
    className:
      "border-cyan-500/35 bg-cyan-500/10 text-cyan-200 ring-cyan-500/20",
    label: "Early bird",
  },
};

type EventCardProps = {
  event: HackathonEvent;
};

export function EventCard({ event }: EventCardProps) {
  const badge = statusStyles[event.registrationStatus];

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl shadow-black/30 transition hover:-translate-y-0.5 hover:border-emerald-500/25 hover:bg-zinc-900/80 hover:shadow-emerald-500/5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold leading-snug text-white transition group-hover:text-emerald-50">
          {event.title}
        </h2>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ${badge.className}`}
        >
          {badge.label}
        </span>
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

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-zinc-600 bg-zinc-950/40 px-4 py-2.5 text-sm font-semibold text-zinc-100 outline-none transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500/50"
        >
          View Details
        </button>
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/20 outline-none transition hover:bg-emerald-400 hover:shadow-emerald-500/35 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        >
          Approve
        </button>
      </div>
    </article>
  );
}

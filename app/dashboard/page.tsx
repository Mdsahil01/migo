import type { Metadata } from "next";
import Link from "next/link";

import { Navbar } from "@/components/home/navbar";
import { SiteFooter } from "@/components/home/site-footer";
import { mockHackathonEvents } from "@/data/mock-events";

export const metadata: Metadata = {
  title: "Dashboard — MIGO",
  description:
    "Track approved hackathons, upcoming launches, and your next mission in MIGO.",
};

const approvedEventIds = new Set(["1", "2", "4", "5"]);

const now = new Date();

const approvedEvents = mockHackathonEvents
  .filter((event) => approvedEventIds.has(event.id))
  .sort(
    (a, b) =>
      new Date(a.startsAtIso).getTime() - new Date(b.startsAtIso).getTime(),
  );

const upcomingEvents = mockHackathonEvents.filter(
  (event) => new Date(event.startsAtIso).getTime() > now.getTime(),
);

const upcomingApprovedEvents = approvedEvents.filter(
  (event) => new Date(event.startsAtIso).getTime() > now.getTime(),
);

const nextMission = upcomingApprovedEvents[0];

const totalEventsCount = mockHackathonEvents.length;
const teamMembersCount = 12;
const calendarAddedCount = upcomingEvents.length;

const dashboardStats = [
  { label: "Approved Events", value: approvedEvents.length.toString() },
  { label: "Upcoming Events", value: totalEventsCount.toString() },
  { label: "Team Members", value: teamMembersCount.toString() },
  { label: "Calendar Added", value: calendarAddedCount.toString() },
] as const;

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-lg shadow-black/20">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-white">{value}</p>
    </article>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <Navbar />

      <main>
        <section
          className="relative overflow-hidden border-b border-zinc-800/80 px-4 py-12 sm:px-6 sm:py-16"
          aria-labelledby="dashboard-heading"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-20%,rgba(16,185,129,0.14),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400/90">
              Organizer dashboard
            </p>
            <h1
              id="dashboard-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Welcome back to mission control
            </h1>
            <p className="mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
              Keep approvals moving, monitor upcoming launches, and align your
              team before demo day.
            </p>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 sm:py-14" aria-label="Dashboard stats">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {dashboardStats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
          </div>
        </section>

        <section
          className="px-4 pb-8 sm:px-6 sm:pb-10"
          aria-labelledby="upcoming-approved-events"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2
                id="upcoming-approved-events"
                className="text-xl font-semibold tracking-tight text-white"
              >
                Upcoming approved events
              </h2>
              <Link
                href="/events"
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 outline-none transition hover:bg-zinc-800/60 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-emerald-500/50"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {upcomingApprovedEvents.slice(0, 4).map((event) => (
                <article
                  key={event.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-5 transition hover:border-emerald-500/30 hover:bg-zinc-900/70"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                    <span className="rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                      Approved
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{event.organizer}</p>
                  <dl className="mt-4 grid gap-2 text-sm">
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-zinc-500">Date</dt>
                      <dd className="font-medium text-zinc-200">{event.date}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-zinc-500">Location</dt>
                      <dd className="font-medium text-zinc-200">{event.location}</dd>
                    </div>
                  </dl>
                  <Link
                    href={`/events/${event.id}`}
                    className="mt-5 inline-flex rounded-lg border border-zinc-700 bg-zinc-950/40 px-3.5 py-2 text-sm font-semibold text-zinc-100 outline-none transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                  >
                    Open details
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-12 sm:px-6 sm:pb-16" aria-labelledby="next-mission">
          <div className="mx-auto max-w-6xl">
            <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/55 shadow-xl shadow-black/30">
              <div className="bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-transparent px-6 py-6 sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  Next mission
                </p>
                <h2
                  id="next-mission"
                  className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl"
                >
                  {nextMission?.title ?? "No approved missions yet"}
                </h2>
              </div>

              <div className="px-6 py-6 sm:px-8">
                {nextMission ? (
                  <>
                    <p className="max-w-3xl text-zinc-300">{nextMission.description}</p>
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3">
                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          Date
                        </p>
                        <p className="mt-1 text-sm font-semibold text-zinc-100">
                          {nextMission.date}
                        </p>
                      </div>
                      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3">
                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          Team size
                        </p>
                        <p className="mt-1 text-sm font-semibold text-zinc-100">
                          {nextMission.teamSize}
                        </p>
                      </div>
                      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3">
                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          Theme
                        </p>
                        <p className="mt-1 text-sm font-semibold text-zinc-100">
                          {nextMission.theme}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-zinc-400">
                    Approve an event from the events list to unlock your next
                    highlighted mission.
                  </p>
                )}
              </div>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

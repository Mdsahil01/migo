import type { Metadata } from "next";

import Link from "next/link";

import { notFound } from "next/navigation";

import { DetailedMissionBriefing } from "@/components/events/detailed-mission-briefing";
import { EventActions } from "@/components/events/event-actions";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { Navbar } from "@/components/home/navbar";
import { SiteFooter } from "@/components/home/site-footer";
import {
  getEventDetailedBriefing,
  getEventHeroSummary,
  getEventSummary,
} from "@/lib/events/description";
import {
  formatDateTime,
  formatMode,
  formatOrganizerType,
  formatTeamSize,
  getMapsSearchUrl,
  missionStatusBadge,
  shouldShowMapsLink,
} from "@/lib/events/display";
import type { EventRecord } from "@/lib/events/types";
import { supabase } from "@/lib/supabase";

type EventDetailsPageProps = {
  params: Promise<{
    eventId: string;
  }>;
};

type IntelligenceItem = {
  label: string;
  value: string;
};

function IntelligenceCard({
  label,
  value,
}: IntelligenceItem) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-4 py-4 transition hover:border-zinc-700/80">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="text-sm font-medium leading-snug text-zinc-100">
        {value}
      </p>
    </div>
  );
}

function buildIntelligenceGrid(
  event: EventRecord,
): IntelligenceItem[] {
  const items: IntelligenceItem[] =
    [];

  const mode = formatMode(
    event.mode,
  );

  if (mode) {
    items.push({
      label: "Mode",
      value: mode,
    });
  }

  const teamSize = formatTeamSize(
    event.min_team_size,
    event.max_team_size,
  );

  if (teamSize) {
    items.push({
      label: "Team size",
      value: teamSize,
    });
  }

  if (event.prize_pool?.trim()) {
    items.push({
      label: "Prize pool",
      value: event.prize_pool.trim(),
    });
  }

  const registrationDeadline =
    formatDateTime(
      event.registration_deadline,
    );

  if (registrationDeadline) {
    items.push({
      label: "Registration deadline",
      value: registrationDeadline,
    });
  }

  if (event.organizer_name?.trim()) {
    items.push({
      label: "Organizer",
      value:
        event.organizer_name.trim(),
    });
  }

  const organizerType =
    formatOrganizerType(
      event.organizer_type,
    );

  if (organizerType) {
    items.push({
      label: "Organizer type",
      value: organizerType,
    });
  }

  if (event.location?.trim()) {
    items.push({
      label: "Location",
      value: event.location.trim(),
    });
  }

  const startsAt = formatDateTime(
    event.starts_at,
  );

  if (startsAt) {
    items.push({
      label: "Starts at",
      value: startsAt,
    });
  }

  return items;
}

export async function generateMetadata({
  params,
}: EventDetailsPageProps): Promise<Metadata> {
  const { eventId } =
    await params;

  const { data: event } =
    await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

  if (!event) {
    return {
      title:
        "Mission not found — MIGO",
    };
  }

  return {
    title: `${event.title} — MIGO`,
    description:
      getEventHeroSummary(
        event as EventRecord,
      ) ||
      getEventSummary(
        event as EventRecord,
      ),
  };
}

export default async function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  const { eventId } =
    await params;

  const { data: event } =
    await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

  if (!event) {
    notFound();
  }

  const mission =
    event as EventRecord;

  const heroSummary =
    getEventHeroSummary(mission);

  const detailedBriefing =
    getEventDetailedBriefing(mission);

  const intelligenceItems =
    buildIntelligenceGrid(mission);

  const tags = (
    mission.tags ?? []
  ).filter(
    (tag: string) => tag?.trim(),
  );

  const showMaps =
    shouldShowMapsLink(mission);

  const hasRegistrationLink =
    Boolean(
      mission.registration_link?.trim(),
    );

  const hasSourceUrl = Boolean(
    mission.source_url?.trim(),
  );

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <Navbar />

      <main className="pb-16">
        {/* SECTION 1 — Hero */}
        <section className="relative overflow-hidden border-b border-zinc-800/80">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.14),transparent)]"
            aria-hidden
          />

          <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
            <nav
              className="mb-8 text-sm text-zinc-500"
              aria-label="Breadcrumb"
            >
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href="/events"
                    className="rounded-md font-medium text-emerald-400/90 transition hover:text-emerald-300"
                  >
                    Events
                  </Link>
                </li>

                <li
                  aria-hidden
                  className="text-zinc-600"
                >
                  /
                </li>

                <li className="font-medium text-zinc-300">
                  Mission intelligence
                </li>
              </ol>
            </nav>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
                Operations dashboard
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <EventStatusBadge
                  custom={missionStatusBadge(
                    mission.status,
                  )}
                />

                {mission.source_platform?.trim() ? (
                  <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                    {mission.source_platform.trim()}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {mission.title}
              </h1>

              {heroSummary ? (
                <p className="mt-5 max-w-2xl text-[15px] leading-7 text-zinc-400 sm:text-base sm:leading-relaxed">
                  {heroSummary}
                </p>
              ) : null}

              {tags.length > 0 ? (
                <ul
                  className="mt-5 flex flex-wrap gap-2"
                  aria-label="Event tags"
                >
                  {tags.map((tag) => (
                    <li key={tag}>
                      <span className="inline-flex rounded-full border border-zinc-700 bg-zinc-950/60 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
                        {tag}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 sm:py-12">
          {/* SECTION 2 — Intelligence grid */}
          {intelligenceItems.length > 0 ? (
            <section aria-labelledby="mission-intelligence-heading">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2
                  id="mission-intelligence-heading"
                  className="text-lg font-semibold text-white"
                >
                  Mission intelligence
                </h2>

                {showMaps ? (
                  <a
                    href={getMapsSearchUrl(
                      mission.location,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/20"
                  >
                    Open in Maps
                  </a>
                ) : null}
              </div>

              <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {intelligenceItems.map(
                  (item) => (
                    <IntelligenceCard
                      key={item.label}
                      label={item.label}
                      value={item.value}
                    />
                  ),
                )}
              </dl>
            </section>
          ) : null}

          {/* Registration */}
          {hasRegistrationLink ||
          hasSourceUrl ? (
            <section
              aria-labelledby="registration-heading"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8"
            >
              <h2
                id="registration-heading"
                className="text-lg font-semibold text-white"
              >
                Registration &amp; source
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                External links for team
                coordination and verification.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {hasRegistrationLink ? (
                  <a
                    href={
                      mission.registration_link!
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
                  >
                    Register for mission
                  </a>
                ) : null}

                {hasSourceUrl ? (
                  <a
                    href={
                      mission.source_url!
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-600 bg-zinc-950/40 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-800"
                  >
                    View source page
                  </a>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* Operational actions */}
          <section
            aria-labelledby="operations-heading"
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8"
          >
            <h2
              id="operations-heading"
              className="text-lg font-semibold text-white"
            >
              Mission operations
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Approve, reject, prepare
              resources, or add to calendar.
            </p>

            <EventActions
              eventId={mission.id}
              title={mission.title}
              location={mission.location}
              starts_at={mission.starts_at}
              registration_link={
                mission.registration_link ??
                undefined
              }
              resources={
                mission.resources ?? undefined
              }
            />
          </section>

          {detailedBriefing ? (
            <DetailedMissionBriefing
              content={detailedBriefing}
            />
          ) : null}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

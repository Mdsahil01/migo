import type { Metadata } from "next";

import Link from "next/link";

import { notFound } from "next/navigation";

import { Navbar } from "@/components/home/navbar";

import { SiteFooter } from "@/components/home/site-footer";

import { supabase } from "@/lib/supabase";

import { EventActions } from "@/components/events/event-actions";

type EventDetailsPageProps = {
  params: Promise<{
    eventId: string;
  }>;
};

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
      event.description,
  };
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </dt>

      <dd className="text-sm font-medium leading-snug text-zinc-100">
        {value}
      </dd>
    </div>
  );
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

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-zinc-800/80">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.14),transparent)]"
            aria-hidden
          />

          <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
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
                  Mission Details
                </li>
              </ol>
            </nav>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">
                CURRENT MISSION
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
                {event.title}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-relaxed text-zinc-300">
                {event.description}
              </p>

              <EventActions
  eventId={event.id}
  title={event.title}
  location={event.location}
  starts_at={event.starts_at}
  registration_link={
    event.registration_link
  }
/>         </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-10">
              <article className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-white">
                  Mission Overview
                </h2>

                <p className="mt-4 text-base leading-relaxed text-zinc-300">
                  {event.description}
                </p>
              </article>

              <article className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-white">
                  Mission Status
                </h2>

                <div className="mt-5 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                  {event.status}
                </div>
              </article>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-lg shadow-black/20">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  Mission Intelligence
                </h2>

                <dl className="mt-5 grid gap-3">
                  <InfoRow
                    label="Date"
                    value={new Date(
                      event.starts_at,
                    ).toLocaleDateString()}
                  />

                  <InfoRow
                    label="Location"
                    value={
                      event.location
                    }
                  />

                  <InfoRow
                    label="Status"
                    value={
                      event.status
                    }
                  />

                  <InfoRow
                    label="Created By"
                    value={
                      event.created_by ||
                      "MIGO Team"
                    }
                  />
                </dl>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
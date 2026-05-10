import Link from "next/link";

export function AnchorSections() {
  return (
    <>
      <section
        id="events"
        className="scroll-mt-20 border-b border-zinc-800/80 bg-zinc-900/30 px-4 py-16 sm:px-6 sm:py-20"
        aria-labelledby="events-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="events-heading"
            className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            Explore events
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-400">
            When your school hosts go live, you&apos;ll see curated listings,
            registration windows, and venue details — all in one student-first
            feed.
          </p>
          <p className="mt-6 text-sm text-zinc-500">
            Tip: bookmark this section once your campus connectors publish their
            first hackathon on MIGO.
          </p>
        </div>
      </section>

      <section
        id="teams"
        className="scroll-mt-20 border-b border-zinc-800/80 bg-zinc-950 px-4 py-16 sm:px-6 sm:py-20"
        aria-labelledby="teams-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="teams-heading"
            className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            Join a team
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Post what you bring (design, ML, pitch), browse open roles, and match
            with hackers who complement your stack — without fifty sticky-note
            threads.
          </p>
          <Link
            href="#features"
            className="mt-8 inline-flex text-sm font-semibold text-emerald-400 outline-none transition hover:text-emerald-300 focus-visible:underline focus-visible:underline-offset-4"
          >
            See how squads work →
          </Link>
        </div>
      </section>
    </>
  );
}

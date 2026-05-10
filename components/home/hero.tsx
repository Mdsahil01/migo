import Link from "next/link";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden border-b border-zinc-800/80 bg-zinc-950 px-4 py-16 sm:px-6 sm:py-24 lg:py-28 lg:pt-32"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.15),transparent)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        <p className="mb-4 inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1 text-xs font-medium text-emerald-400 backdrop-blur-sm">
          Built for student hackathons
        </p>
        <h1
          id="hero-heading"
          className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Coordinate teams.{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Ship projects faster.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
          MIGO helps organizers and hackers stay aligned — discover events, form
          squads, and collaborate from idea to demo night without the chaos.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/events"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-3.5 text-base font-semibold text-zinc-950 shadow-lg shadow-emerald-500/25 outline-none transition hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-emerald-500/40 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            Explore Events
          </Link>
          <Link
            href="#teams"
            className="inline-flex items-center justify-center rounded-full border border-zinc-600 bg-zinc-900/50 px-8 py-3.5 text-base font-semibold text-zinc-100 outline-none backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-zinc-800 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500/50"
          >
            Join Team
          </Link>
        </div>
      </div>
    </section>
  );
}

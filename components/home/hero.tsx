import Link from "next/link";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-black px-4 pb-24 pt-24 sm:px-6 lg:px-8 lg:pb-32 lg:pt-36"
      aria-labelledby="hero-heading"
    >
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-72 w-72 bg-purple-500/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-72 w-72 bg-zinc-700/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
        {/* Small Label */}
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-purple-400">
          MIGO HQ
        </p>

        {/* Main Heading */}
        <h1
          id="hero-heading"
          className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Built by students
          <br />
          obsessed with
          <span className="text-purple-400"> building real things.</span>
        </h1>

        {/* Subheading */}
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
          A digital headquarters for ambitious hackathon teams —
          coordinate missions, stay aligned, and ship faster together.
        </p>

        {/* Buttons */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Open Dashboard
          </Link>

          <Link
            href="/team"
            className="inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/60 px-8 py-3 text-sm font-semibold text-white transition hover:border-purple-500 hover:bg-zinc-800"
          >
            Team Space
          </Link>
        </div>

        {/* Mission Panel */}
        <div className="mt-20 w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Current Mission
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                HealthHack Weekend
              </h2>
            </div>

            <div className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-medium text-purple-300">
              Mission Approved
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Date
              </p>

              <p className="mt-2 text-lg font-medium text-zinc-100">
                Aug 9–10
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Location
              </p>

              <p className="mt-2 text-lg font-medium text-zinc-100">
                Bangalore
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Team Status
              </p>

              <p className="mt-2 text-lg font-medium text-zinc-100">
                4 Builders Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
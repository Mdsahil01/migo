import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-black px-4 pb-24 pt-24 sm:px-6 lg:px-8 lg:pb-32 lg:pt-36"
      aria-labelledby="hero-heading"
    >
      {/* Ambient Background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        {/* Main Glow */}
        <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl animate-pulse" />

        {/* Secondary Glow */}
        <div className="absolute bottom-0 left-1/3 h-72 w-72 bg-cyan-300/5 blur-3xl" />

        {/* Noise / Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_60%)]" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* Label */}
        <p className="mb-10 text-[11px] font-medium uppercase tracking-[0.45em] text-zinc-500">
          MINDSET • GROWTH • EXECUTION
        </p>

        {/* Cinematic Logo Reveal */}
<div className="group relative mb-16">
  {/* Animated Ambient Glow */}
  <div className="absolute inset-0 scale-[1.35] rounded-full bg-cyan-400/15 blur-3xl animate-pulse" />

  {/* Secondary Glow Layer */}
  <div className="absolute inset-0 scale-[1.15] rounded-full bg-white/5 blur-2xl" />

  {/* Logo */}
  <div className="animate-[logoReveal_1.8s_cubic-bezier(0.16,1,0.3,1)]">
    <Image
      src="/migo-logo.png"
      alt="MIGO Logo"
      width={320}
      height={320}
      priority
      className="relative z-10 w-[240px] drop-shadow-[0_0_40px_rgba(34,211,238,0.15)] transition duration-700 group-hover:scale-[1.04] sm:w-[300px] lg:w-[360px]"
    />
  </div>
</div>

        {/* Main Message */}
        <h1
  id="hero-heading"
  className="max-w-4xl text-center text-white"
>
  <span className="block text-3xl font-semibold italic tracking-[-0.06em] sm:text-4xl lg:text-5xl">
    Elevate your mindset.
  </span>

  <span className="mt-2 block text-3xl font-semibold italic tracking-[-0.06em] text-zinc-400 sm:text-4xl lg:text-5xl">
    Accelerate your growth.
  </span>
</h1>

        {/* Subtext */}
        <p className="mt-10 max-w-2xl text-base leading-[1.9] tracking-[-0.02em] text-zinc-500 sm:text-lg">
          Built for ambitious students operating beyond classrooms —
          pushing limits, executing relentlessly, and growing together.
        </p>

        {/* Buttons */}
        <div className="mt-14 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition duration-300 hover:scale-[1.02] hover:bg-zinc-200"
          >
            Open Dashboard
          </Link>

          <Link
            href="/team"
            className="inline-flex items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/60 px-8 py-3 text-sm font-semibold text-white transition duration-300 hover:scale-[1.02] hover:border-zinc-700 hover:bg-zinc-800"
          >
            Team Space
          </Link>
        </div>

        {/* Mission Panel */}
        <div className="mt-24 w-full max-w-3xl rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6 backdrop-blur-xl transition duration-500 hover:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
                CURRENT MISSION
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                HealthHack Weekend
              </h2>
            </div>

            <div className="rounded-full border border-cyan-400/10 bg-cyan-400/5 px-4 py-2 text-xs font-medium text-cyan-200">
              Mission Approved
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">
                Date
              </p>

              <p className="mt-2 text-lg font-medium text-zinc-100">
                Aug 9–10
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">
                Location
              </p>

              <p className="mt-2 text-lg font-medium text-zinc-100">
                Bangalore
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-600">
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
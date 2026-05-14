import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="max-w-lg text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-400">
          MIGO ACCESS CONTROL
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Access restricted.
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-zinc-400">
          This workspace is currently limited to approved
          MIGO team members only.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
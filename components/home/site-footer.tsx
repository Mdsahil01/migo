import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 text-xs font-bold text-zinc-950">
            M
          </span>
          <span className="font-semibold text-zinc-200">MIGO</span>
          <span className="text-zinc-600">·</span>
          <span className="text-sm text-zinc-500">
            Hackathons, coordinated.
          </span>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
          <Link
            href="/events"
            className="transition hover:text-zinc-300"
          >
            Events
          </Link>
          <Link href="#teams" className="transition hover:text-zinc-300">
            Teams
          </Link>
          <Link href="#features" className="transition hover:text-zinc-300">
            Features
          </Link>
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-center text-xs text-zinc-600 sm:text-left">
        © {new Date().getFullYear()} MIGO. Built for students.
      </p>
    </footer>
  );
}

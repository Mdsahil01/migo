"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/events", label: "Events" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/#teams", label: "Teams" },
  { href: "/#features", label: "Features" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-lg outline-none ring-emerald-500/40 transition hover:opacity-90 focus-visible:ring-2"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 transition group-hover:shadow-emerald-500/35"
            aria-hidden
          >
            M
          </span>
          <span className="text-lg font-semibold tracking-tight text-zinc-100 transition group-hover:text-white">
            MIGO
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 outline-none transition hover:bg-zinc-800/60 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/events"
            className="hidden rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/25 outline-none transition hover:bg-emerald-400 hover:shadow-emerald-500/40 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 sm:inline-flex"
          >
            Explore Events
          </Link>

          <button
            type="button"
            className="inline-flex rounded-lg border border-zinc-700 bg-zinc-900/50 p-2 text-zinc-300 outline-none transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500/50 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-zinc-800/80 bg-zinc-950 md:hidden ${open ? "block" : "hidden"}`}
      >
        <nav
          className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6"
          aria-label="Mobile navigation"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800/80 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/events"
            className="mt-2 rounded-full bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
            onClick={() => setOpen(false)}
          >
            Explore Events
          </Link>
        </nav>
      </div>
    </header>
  );
}

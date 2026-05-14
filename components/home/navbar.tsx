 "use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/team", label: "Team" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { isSignedIn } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 outline-none transition hover:opacity-90"
        >
          <Image
            src="/migo-logo.png"
            alt="MIGO Logo"
            width={56}
            height={56}
            className="rounded-xl transition duration-300 group-hover:scale-105"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-2 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-cyan-300"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {mounted &&
            (isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "h-10 w-10 border border-cyan-500/30 shadow-lg shadow-cyan-500/20",
                  },
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <button className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20">
                  Sign In
                </button>
              </SignInButton>
            ))}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex rounded-full border border-zinc-800 bg-zinc-900/60 p-2 text-zinc-300 transition hover:border-cyan-500/40 hover:bg-zinc-800 hover:text-white md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">
              {open ? "Close menu" : "Open menu"}
            </span>

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

      {/* Mobile Navigation */}
      <div
        id="mobile-nav"
        className={`border-t border-zinc-900 bg-black md:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav
          className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 sm:px-6"
          aria-label="Mobile navigation"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-cyan-300"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
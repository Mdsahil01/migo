import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-900 bg-black px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Image
            src="/migo-logo.png"
            alt="MIGO Logo"
            width={42}
            height={42}
            className="h-10 w-auto opacity-90"
          />

          <div>
            <p className="text-sm font-medium tracking-[0.25em] text-zinc-200">
              MIGO
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Elevate your mindset. Accelerate your growth.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6 text-sm text-zinc-600">
          <p>Built for ambitious students.</p>

          <div className="h-4 w-px bg-zinc-800" />

          <p>© 2026 MIGO</p>
        </div>
      </div>
    </footer>
  );
}
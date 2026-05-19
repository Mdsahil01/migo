type DetailedMissionBriefingProps = {
  content: string;
};

export function DetailedMissionBriefing({
  content,
}: DetailedMissionBriefingProps) {
  return (
    <section
      aria-labelledby="detailed-briefing-heading"
      className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8"
    >
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-500/40 [&::-webkit-details-marker]:hidden">
          <div>
            <h2
              id="detailed-briefing-heading"
              className="text-lg font-semibold text-white"
            >
              Detailed Mission Briefing
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Source details — expand when
              needed
            </p>
          </div>

          <span className="shrink-0 rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 py-1.5 text-xs font-medium text-zinc-400 transition group-open:text-cyan-200">
            <span className="group-open:hidden">
              Show briefing
            </span>
            <span className="hidden group-open:inline">
              Hide briefing
            </span>
          </span>
        </summary>

        <div className="mt-5 max-w-3xl rounded-xl border border-zinc-800/80 bg-zinc-950/50 px-5 py-5">
          <p className="whitespace-pre-wrap text-[15px] leading-7 text-zinc-300">
            {content}
          </p>
        </div>
      </details>
    </section>
  );
}

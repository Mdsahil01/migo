export const SOURCE_PLATFORMS = {
  DEVFOLIO: "Devfolio",
  UNSTOP: "Unstop",
  LUMA: "Luma",
} as const;

export type SourcePlatform =
  (typeof SOURCE_PLATFORMS)[keyof typeof SOURCE_PLATFORMS];

export const PLATFORM_BADGE_STYLES: Record<
  string,
  string
> = {
  Devfolio:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  Unstop:
    "border-orange-500/30 bg-orange-500/10 text-orange-200",
  Luma: "border-violet-500/30 bg-violet-500/10 text-violet-200",
};

export function getPlatformBadgeStyle(
  platform?: string | null,
): string {
  if (!platform?.trim()) {
    return "border-zinc-600 bg-zinc-800/80 text-zinc-300";
  }

  return (
    PLATFORM_BADGE_STYLES[platform] ??
    "border-cyan-500/30 bg-cyan-500/10 text-cyan-200"
  );
}

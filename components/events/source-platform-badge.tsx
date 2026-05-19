import { getPlatformBadgeStyle } from "@/lib/events/platforms";

type SourcePlatformBadgeProps = {
  platform?: string | null;
  className?: string;
};

export function SourcePlatformBadge({
  platform,
  className = "",
}: SourcePlatformBadgeProps) {
  if (!platform?.trim()) {
    return null;
  }

  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${getPlatformBadgeStyle(platform)} ${className}`}
    >
      {platform.trim()}
    </span>
  );
}

import type { EventRecord } from "@/lib/events/types";

import { getEventHeroSummary } from "@/lib/events/description";

export function formatTeamSize(
  min?: number | null,
  max?: number | null,
): string | null {
  if (
    min != null &&
    max != null
  ) {
    if (min === max) {
      return `${min} member${min === 1 ? "" : "s"}`;
    }

    return `${min}–${max} members`;
  }

  if (max != null) {
    return `Up to ${max} members`;
  }

  if (min != null) {
    return `${min}+ members`;
  }

  return null;
}

export function formatMode(
  mode?: string | null,
): string | null {
  if (!mode?.trim()) {
    return null;
  }

  return (
    mode.charAt(0).toUpperCase() +
    mode.slice(1).toLowerCase()
  );
}

export function formatDateTime(
  iso?: string | null,
): string | null {
  if (!iso) {
    return null;
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatOrganizerType(
  type?: string | null,
): string | null {
  if (!type?.trim()) {
    return null;
  }

  return (
    type.charAt(0).toUpperCase() +
    type.slice(1).toLowerCase()
  );
}

export function getMapsSearchUrl(
  location: string,
): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

export function shouldShowMapsLink(
  event: Pick<
    EventRecord,
    "location" | "mode"
  >,
): boolean {
  const location =
    event.location?.trim();

  if (!location) {
    return false;
  }

  if (
    event.mode?.toLowerCase() ===
    "online"
  ) {
    return false;
  }

  if (
    location.toLowerCase() ===
    "online"
  ) {
    return false;
  }

  return true;
}

export function missionStatusBadge(
  status: string,
): {
  label: string;
  className: string;
} {
  const normalized =
    status.toLowerCase();

  if (normalized === "approved") {
    return {
      label: "Approved",
      className:
        "border-emerald-500/35 bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
    };
  }

  if (normalized === "rejected") {
    return {
      label: "Rejected",
      className:
        "border-red-500/35 bg-red-500/10 text-red-300 ring-red-500/20",
    };
  }

  if (normalized === "reviewing") {
    return {
      label: "Reviewing",
      className:
        "border-amber-500/35 bg-amber-500/10 text-amber-200 ring-amber-500/20",
    };
  }

  return {
    label: status,
    className:
      "border-zinc-600 bg-zinc-800/80 text-zinc-300 ring-zinc-600/40",
  };
}

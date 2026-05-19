import type { RegistrationStatus } from "@/data/mock-events";

const statusStyles: Record<
  RegistrationStatus,
  { className: string; label: string }
> = {
  Open: {
    className:
      "border-emerald-500/35 bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
    label: "Open",
  },

  "Closing soon": {
    className:
      "border-amber-500/35 bg-amber-500/10 text-amber-200 ring-amber-500/20",
    label: "Closing soon",
  },

  Waitlist: {
    className:
      "border-violet-500/35 bg-violet-500/10 text-violet-200 ring-violet-500/20",
    label: "Waitlist",
  },

  Closed: {
    className:
      "border-zinc-600 bg-zinc-800/80 text-zinc-400 ring-zinc-600/40",
    label: "Closed",
  },

  "Early bird": {
    className:
      "border-cyan-500/35 bg-cyan-500/10 text-cyan-200 ring-cyan-500/20",
    label: "Early bird",
  },
};

type CustomBadge = {
  label: string;
  className: string;
};

type EventStatusBadgeProps =
  | {
      status: RegistrationStatus;
      custom?: never;
    }
  | {
      status?: never;
      custom: CustomBadge;
    };

function isCustomBadge(
  props: EventStatusBadgeProps,
): props is {
  custom: CustomBadge;
  status?: never;
} {
  return "custom" in props;
}

export function EventStatusBadge(
  props: EventStatusBadgeProps,
) {
  const badge = isCustomBadge(
    props,
  )
    ? props.custom
    : statusStyles[
        props.status
      ] || {
        label: props.status,
        className:
          "border-zinc-700 bg-zinc-800 text-zinc-300 ring-zinc-700/40",
      };

  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}
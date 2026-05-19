import type { EventRecord } from "@/lib/events/types";

type EventDescriptionFields = Pick<
  EventRecord,
  | "short_description"
  | "full_description"
  | "description"
>;

/** List cards, metadata, and legacy consumers. */
export function getEventSummary(
  event: EventDescriptionFields,
): string {
  return (
    event.short_description?.trim() ||
    event.description?.trim() ||
    truncate(
      event.full_description?.trim() ??
        "",
      320,
    ) ||
    ""
  );
}

/** Mission detail body — prefers full description when present. */
export function getEventDetailBody(
  event: EventDescriptionFields,
): string {
  const summary =
    getEventSummary(event);
  const full =
    event.full_description?.trim();

  if (full && full !== summary) {
    return full;
  }

  return (
    summary ||
    event.description?.trim() ||
    ""
  );
}

function truncate(
  text: string,
  maxLength: number,
): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trim()}…`;
}

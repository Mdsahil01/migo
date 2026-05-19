import type { EventRecord } from "@/lib/events/types";

import {
  cleanScrapedContent,
  collapseForComparison,
  truncateOperationalSummary,
} from "@/lib/events/content";

type EventDescriptionFields = Pick<
  EventRecord,
  | "short_description"
  | "full_description"
  | "description"
>;

/** Hero + list cards — never uses full_description. */
export function getEventHeroSummary(
  event: EventDescriptionFields,
): string {
  const raw =
    event.short_description?.trim() ||
    event.description?.trim() ||
    "";

  if (!raw) {
    return "";
  }

  return truncateOperationalSummary(
    cleanScrapedContent(raw),
  );
}

/** List cards, metadata — prefers short fields, may fall back to truncated full. */
export function getEventSummary(
  event: EventDescriptionFields,
): string {
  const hero =
    getEventHeroSummary(event);

  if (hero) {
    return hero;
  }

  const fromFull =
    event.full_description?.trim();

  if (!fromFull) {
    return "";
  }

  return truncateOperationalSummary(
    cleanScrapedContent(fromFull),
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

  if (full) {
    const cleaned = cleanScrapedContent(
      full,
      { preserveBreaks: true },
    );

    if (
      cleaned &&
      collapseForComparison(
        cleaned,
      ) !==
        collapseForComparison(
          summary,
        )
    ) {
      return cleaned;
    }
  }

  return (
    summary ||
    cleanScrapedContent(
      event.description?.trim() ??
        "",
      { preserveBreaks: true },
    )
  );
}

/** Lower-page briefing — cleaned full text, omitted if redundant with hero. */
export function getEventDetailedBriefing(
  event: EventDescriptionFields,
): string | null {
  const hero =
    getEventHeroSummary(event);

  const raw =
    event.full_description?.trim() ||
    event.description?.trim();

  if (!raw) {
    return null;
  }

  const cleaned = cleanScrapedContent(
    raw,
    { preserveBreaks: true },
  );

  if (!cleaned) {
    return null;
  }

  const heroKey =
    collapseForComparison(hero);
  const fullKey =
    collapseForComparison(cleaned);

  if (heroKey && fullKey === heroKey) {
    return null;
  }

  if (
    hero &&
    cleaned.length <=
      hero.length + 80
  ) {
    return null;
  }

  if (
    !hero &&
    cleaned.length < 120
  ) {
    return null;
  }

  return cleaned;
}

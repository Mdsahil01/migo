import type { OrganizerType } from "@/lib/events/types";

import {
  cleanScrapedContent,
  truncateOperationalSummary,
} from "@/lib/events/content";

export function stripMarkdown(
  text: string,
): string {
  return text
    .replace(/&#013;/g, "\n")
    .replace(/\*\*/g, "")
    .replace(
      /\[([^\]]+)\]\([^)]+\)/g,
      "$1",
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function decodeEntityText(
  text: string,
): string {
  return text
    .replace(/&#013;/g, "\n")
    .replace(/&nbsp;/g, " ")
    .trim();
}

export function buildShortFromText(
  primary: string | undefined,
  fallback: string | undefined,
  label: string,
): string {
  if (primary?.trim()) {
    return truncateOperationalSummary(
      cleanScrapedContent(primary),
    );
  }

  const stripped = fallback
    ? stripMarkdown(fallback)
    : "";

  if (!stripped) {
    return `${label} event on MIGO network.`;
  }

  const firstParagraph =
    stripped
      .split("\n")
      .find(
        (line) =>
          line.trim().length > 20,
      ) ?? stripped;

  return truncateOperationalSummary(
    firstParagraph,
  );
}

export function buildFullFromText(
  ...parts: (string | undefined)[]
): string {
  const raw = parts
    .filter(Boolean)
    .join("\n\n");

  return decodeEntityText(raw);
}

export function inferOrganizerNameFromTitle(
  title: string,
): string | null {
  const match = title.match(
    /^(.+?)['']s\s+/i,
  );

  return match?.[1]?.trim() ?? null;
}

export function inferOrganizerTypeFromText(
  ...parts: (string | undefined | null)[]
): OrganizerType | null {
  const blob = parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    /\b(university|college|campus|institute|iit|nit|student\s+branch|school|bits|pes|rv\s+college|bms)\b/.test(
      blob,
    )
  ) {
    return "college";
  }

  if (
    /\b(startup|founder|yc\b|seed\s+stage|venture)\b/.test(
      blob,
    )
  ) {
    return "startup";
  }

  if (
    /\b(inc\.?|corp\.?|ltd\.?|llc|technologies|pvt\.?|enterprise)\b/.test(
      blob,
    )
  ) {
    return "company";
  }

  if (
    /\b(society|club|community|chapter|discord|ieee|acm|meetup)\b/.test(
      blob,
    )
  ) {
    return "community";
  }

  return null;
}

export function extractPrizeFromText(
  ...parts: (string | undefined)[]
): string | null {
  const corpus = parts
    .filter(Boolean)
    .join("\n");

  const patterns = [
    /\$[\d,]+(?:\s*(?:k|K))?(?:\s*(?:in\s+)?(?:total\s+)?prizes?)?/i,
    /₹[\d,]+(?:\s*(?:in\s+)?prizes?)?/i,
    /prize\s*pool[^.\n]{0,40}[\d,$₹][^.!\n]*/i,
  ];

  for (const pattern of patterns) {
    const match = corpus.match(pattern);

    if (match?.[0]) {
      return stripMarkdown(
        match[0],
      ).slice(0, 200);
    }
  }

  return null;
}

export type TeamSize = {
  min: number | null;
  max: number | null;
};

export function extractTeamSizeFromText(
  text: string,
): TeamSize {
  const patterns: RegExp[] = [
    /team\s*sizes?\s*(?:of\s*)?(\d+)\s*(?:[-–to]+\s*|\s+to\s+)(\d+)/i,
    /(\d+)\s*[-–]\s*(\d+)\s*(?:hackers|members|people|participants)/i,
    /teams?\s+of\s+(?:up\s+to\s+)?(\d+)/i,
    /(?:max(?:imum)?|up\s+to)\s+(\d+)\s*(?:members|people|hackers)?/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (!match) {
      continue;
    }

    if (match[2]) {
      return {
        min: Number.parseInt(
          match[1],
          10,
        ),
        max: Number.parseInt(
          match[2],
          10,
        ),
      };
    }

    if (match[1]) {
      return {
        min: null,
        max: Number.parseInt(
          match[1],
          10,
        ),
      };
    }
  }

  return { min: null, max: null };
}

export function detectModeFromFlags(options: {
  isOnline?: boolean;
  isHybrid?: boolean;
  region?: string | null;
}): "online" | "offline" | "hybrid" {
  if (options.isHybrid) {
    return "hybrid";
  }

  if (
    options.isOnline ||
    options.region?.toLowerCase() ===
      "online"
  ) {
    return "online";
  }

  return "offline";
}

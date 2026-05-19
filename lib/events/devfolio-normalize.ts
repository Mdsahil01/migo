import type {
  DevfolioHackathonDetail,
  DevfolioListHackathon,
  EventIntelligenceInsert,
  EventMode,
  OrganizerType,
} from "@/lib/events/types";

const SOURCE_PLATFORM = "Devfolio";

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

export function decodeDevfolioText(
  text: string,
): string {
  return text
    .replace(/&#013;/g, "\n")
    .replace(/&nbsp;/g, " ")
    .trim();
}

export function buildLocation(
  detail: DevfolioHackathonDetail,
): string {
  if (detail.is_online) {
    return "Online";
  }

  if (detail.location) {
    return detail.location;
  }

  const parts = [
    detail.city,
    detail.country,
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(", ");
  }

  return "Offline";
}

export function detectMode(
  detail: DevfolioHackathonDetail,
): EventMode {
  if (
    detail.hackathon_setting
      ?.is_hybrid
  ) {
    return "hybrid";
  }

  if (detail.is_online) {
    return "online";
  }

  return "offline";
}

export function extractTags(
  listItem: DevfolioListHackathon,
  detail: DevfolioHackathonDetail,
): string[] {
  const tags = new Set<string>();

  for (const bucket of [
    listItem.themes,
    detail.themes,
  ]) {
    for (const entry of bucket ?? []) {
      const name =
        entry.theme?.name?.trim();

      if (
        name &&
        name.toLowerCase() !==
          "no restrictions"
      ) {
        tags.add(name);
      }
    }
  }

  return [...tags];
}

export function buildShortDescription(
  detail: DevfolioHackathonDetail,
): string {
  if (detail.tagline?.trim()) {
    return stripMarkdown(
      detail.tagline,
    ).slice(0, 320);
  }

  const stripped = detail.desc
    ? stripMarkdown(detail.desc)
    : "";

  if (!stripped) {
    return `${detail.name} on Devfolio.`;
  }

  const firstParagraph =
    stripped
      .split("\n")
      .find(
        (line) =>
          line.trim().length > 20,
      ) ?? stripped;

  return firstParagraph
    .slice(0, 320)
    .trim();
}

export function buildFullDescription(
  detail: DevfolioHackathonDetail,
): string {
  const raw =
    detail.desc ||
    detail.tagline ||
    "";

  return decodeDevfolioText(raw);
}

export function extractPrizePool(
  detail: DevfolioHackathonDetail,
): string | null {
  const corpus = [
    detail.desc,
    detail.tagline,
    ...(detail.faqs?.map(
      (faq) =>
        `${faq.question ?? ""} ${faq.answer ?? ""}`,
    ) ?? []),
  ]
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

type TeamSize = {
  min: number | null;
  max: number | null;
};

export function extractTeamSize(
  detail: DevfolioHackathonDetail,
): TeamSize {
  const fromApi: TeamSize = {
    min:
      typeof detail.team_min ===
      "number"
        ? detail.team_min
        : null,
    max:
      typeof detail.team_max ===
      "number"
        ? detail.team_max
        : typeof detail.team_size ===
            "number"
          ? detail.team_size
          : null,
  };

  if (
    fromApi.min !== null ||
    fromApi.max !== null
  ) {
    return fromApi;
  }

  const text = collectTeamSizeText(
    detail,
  );

  return extractTeamSizeFromText(
    text,
  );
}

function collectTeamSizeText(
  detail: DevfolioHackathonDetail,
): string {
  return [
    detail.desc,
    detail.tagline,
    ...(detail.faqs?.flatMap((faq) => [
      faq.question,
      faq.answer,
    ]) ?? []),
  ]
    .filter(Boolean)
    .join("\n");
}

function extractTeamSizeFromText(
  text: string,
): TeamSize {
  const patterns: RegExp[] =
    [
      /team\s*sizes?\s*(?:of\s*)?(\d+)\s*(?:[-–to]+\s*|\s+to\s+)(\d+)/i,
      /(\d+)\s*[-–]\s*(\d+)\s*(?:hackers|members|people|participants)/i,
      /teams?\s+of\s+(?:up\s+to\s+)?(\d+)/i,
      /(?:max(?:imum)?|up\s+to)\s+(\d+)\s*(?:members|people|hackers)?/i,
      /(?:min(?:imum)?)\s+(\d+).{0,40}(?:max(?:imum)?)\s+(\d+)/i,
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
      const size = Number.parseInt(
        match[1],
        10,
      );

      return {
        min: null,
        max: size,
      };
    }
  }

  return { min: null, max: null };
}

export function inferOrganizerName(
  title: string,
): string | null {
  const match = title.match(
    /^(.+?)['']s\s+/i,
  );

  return match?.[1]?.trim() ?? null;
}

export function inferOrganizerType(
  organizerName: string | null,
  title: string,
  detail: DevfolioHackathonDetail,
): OrganizerType | null {
  const blob = [
    organizerName,
    title,
    detail.desc,
    detail.tagline,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    /\b(university|college|campus|institute|iit|nit|student\s+branch|school|uem|bits)\b/.test(
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
    /\b(society|club|community|chapter|discord|ieee|acm)\b/.test(
      blob,
    )
  ) {
    return "community";
  }

  return null;
}

export function normalizeDevfolioEvent(
  listItem: DevfolioListHackathon,
  detail: DevfolioHackathonDetail,
): EventIntelligenceInsert {
  const source_url = `https://${detail.slug}.devfolio.co/`;

  const registration_link =
    detail.hackathon_setting
      ?.external_apply_url ??
    listItem.settings
      ?.external_apply_url ??
    `${source_url}apply`;

  const short_description =
    buildShortDescription(detail);

  const full_description =
    buildFullDescription(detail);

  const organizer_name =
    inferOrganizerName(detail.name);

  const teamSize =
    extractTeamSize(detail);

  const setting =
    detail.hackathon_setting;

  return {
    title: detail.name,
    description: short_description,
    short_description,
    full_description,
    location: buildLocation(detail),
    mode: detectMode(detail),
    latitude:
      setting?.location_latitude ??
      null,
    longitude:
      setting?.location_longitude ??
      null,
    max_team_size: teamSize.max,
    min_team_size: teamSize.min,
    registration_deadline:
      setting?.reg_ends_at ?? null,
    organizer_name,
    organizer_type:
      inferOrganizerType(
        organizer_name,
        detail.name,
        detail,
      ),
    prize_pool:
      extractPrizePool(detail),
    tags: extractTags(
      listItem,
      detail,
    ),
    source_platform: SOURCE_PLATFORM,
    registration_link,
    source_url,
    starts_at:
      detail.starts_at ||
      listItem.starts_at,
    status: "reviewing",
  };
}

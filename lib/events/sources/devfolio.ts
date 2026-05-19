import {
  buildFullFromText,
  buildShortFromText,
  decodeEntityText,
  detectModeFromFlags,
  extractPrizeFromText,
  extractTeamSizeFromText,
  inferOrganizerNameFromTitle,
  inferOrganizerTypeFromText,
} from "@/lib/events/normalize-shared";
import { SOURCE_PLATFORMS } from "@/lib/events/platforms";
import type {
  DevfolioHackathonDetail,
  DevfolioListHackathon,
  EventIntelligenceInsert,
} from "@/lib/events/types";

import {
  MIGO_FETCH_HEADERS,
  type EventSourceAdapter,
  type SourceFetchResult,
} from "./types";

const DEVFOLIO_EXPLORE_URL =
  "https://devfolio.co/explore";

const DEVFOLIO_API_BASE =
  "https://api.devfolio.co/api/hackathons";

function parseExploreHackathons(
  html: string,
): DevfolioListHackathon[] {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  );

  if (!match) {
    throw new Error(
      "Could not find __NEXT_DATA__ on Devfolio explore page",
    );
  }

  const data = JSON.parse(
    match[1],
  ) as {
    props?: {
      pageProps?: {
        dehydratedState?: {
          queries?: Array<{
            state?: {
              data?: Record<
                string,
                DevfolioListHackathon[]
              >;
            };
          }>;
        };
      };
    };
  };

  const queryData =
    data?.props?.pageProps
      ?.dehydratedState?.queries?.[0]
      ?.state?.data;

  if (!queryData) {
    throw new Error(
      "Unexpected Devfolio explore page structure",
    );
  }

  const buckets: DevfolioListHackathon[][] =
    [
      queryData.open_hackathons,
      queryData.upcoming_hackathons,
      queryData.featured_hackathons,
    ].filter(Array.isArray);

  const bySlug =
    new Map<
      string,
      DevfolioListHackathon
    >();

  for (const bucket of buckets) {
    for (const item of bucket) {
      if (item?.slug && item?.name) {
        bySlug.set(
          item.slug,
          item,
        );
      }
    }
  }

  return [...bySlug.values()];
}

async function fetchHackathonDetail(
  slug: string,
): Promise<DevfolioHackathonDetail | null> {
  const response = await fetch(
    `${DEVFOLIO_API_BASE}/${slug}`,
    {
      headers: MIGO_FETCH_HEADERS,
      next: { revalidate: 0 },
    },
  );

  if (!response.ok) {
    console.error(
      `[devfolio] detail fetch failed for ${slug}: HTTP ${response.status}`,
    );
    return null;
  }

  return response.json() as Promise<DevfolioHackathonDetail>;
}

function buildLocation(
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

function extractTags(
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

function extractTeamSize(
  detail: DevfolioHackathonDetail,
): {
  min: number | null;
  max: number | null;
} {
  const fromApi = {
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

  return extractTeamSizeFromText(
    [
      detail.desc,
      detail.tagline,
      ...(detail.faqs?.flatMap((f) => [
        f.question,
        f.answer,
      ]) ?? []),
    ]
      .filter(Boolean)
      .join("\n"),
  );
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
    buildShortFromText(
      detail.tagline,
      detail.desc,
      detail.name,
    );

  const full_description = buildFullFromText(
    detail.desc,
    detail.tagline,
  );

  const organizer_name =
    inferOrganizerNameFromTitle(
      detail.name,
    );

  const setting =
    detail.hackathon_setting;

  const teamSize =
    extractTeamSize(detail);

  return {
    title: detail.name,
    description: short_description,
    short_description,
    full_description,
    location: buildLocation(detail),
    mode: detectModeFromFlags({
      isOnline: detail.is_online,
      isHybrid:
        setting?.is_hybrid ?? false,
    }),
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
      inferOrganizerTypeFromText(
        organizer_name,
        detail.name,
        detail.desc,
        detail.tagline,
      ),
    prize_pool: extractPrizeFromText(
      detail.desc,
      detail.tagline,
    ),
    tags: extractTags(
      listItem,
      detail,
    ),
    source_platform:
      SOURCE_PLATFORMS.DEVFOLIO,
    registration_link,
    source_url,
    starts_at:
      detail.starts_at ||
      listItem.starts_at,
    status: "reviewing",
  };
}

async function fetchDevfolioEvents(): Promise<SourceFetchResult> {
  const errors: string[] = [];
  const events: EventIntelligenceInsert[] =
    [];

  console.log(
    "[devfolio] fetching explore page…",
  );

  const exploreResponse = await fetch(
    DEVFOLIO_EXPLORE_URL,
    {
      headers: MIGO_FETCH_HEADERS,
      next: { revalidate: 0 },
    },
  );

  if (!exploreResponse.ok) {
    throw new Error(
      `Devfolio explore fetch failed: HTTP ${exploreResponse.status}`,
    );
  }

  const exploreHtml =
    await exploreResponse.text();

  const listHackathons =
    parseExploreHackathons(
      exploreHtml,
    );

  console.log(
    `[devfolio] parsed ${listHackathons.length} hackathons`,
  );

  for (const listItem of listHackathons) {
    const detail =
      await fetchHackathonDetail(
        listItem.slug,
      );

    if (!detail) {
      errors.push(
        `Devfolio: failed details for ${listItem.slug}`,
      );
      continue;
    }

    events.push(
      normalizeDevfolioEvent(
        listItem,
        detail,
      ),
    );
  }

  return {
    platform: SOURCE_PLATFORMS.DEVFOLIO,
    events,
    errors,
  };
}

export const devfolioSource: EventSourceAdapter =
  {
    id: "devfolio",
    platform: SOURCE_PLATFORMS.DEVFOLIO,
    fetchEvents: fetchDevfolioEvents,
  };

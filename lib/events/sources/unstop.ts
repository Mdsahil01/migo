import {
  buildFullFromText,
  buildShortFromText,
  detectModeFromFlags,
  extractTeamSizeFromText,
  inferOrganizerTypeFromText,
} from "@/lib/events/normalize-shared";
import { SOURCE_PLATFORMS } from "@/lib/events/platforms";
import type { EventIntelligenceInsert } from "@/lib/events/types";

import {
  MIGO_FETCH_HEADERS,
  type EventSourceAdapter,
  type SourceFetchResult,
} from "./types";

const UNSTOP_SEARCH_BASE =
  "https://unstop.com/api/public/opportunity/search";

const MAX_PAGES = 3;

type UnstopOrganisation = {
  name?: string;
};

type UnstopSeoDetail = {
  title?: string;
  description?: string;
};

type UnstopOpportunity = {
  id: number;
  title: string;
  public_url: string;
  web_url?: string | null;
  start_date: string;
  end_date?: string;
  location?: string | null;
  region?: string | null;
  type?: string;
  subtype?: string | null;
  overall_prizes?: string | null;
  organisation?: UnstopOrganisation | null;
  festival?: string | null;
  tags?: string[] | null;
  seo_details?: UnstopSeoDetail[] | null;
  regnRequirements?: {
    min_team_size?: number;
    max_team_size?: number;
    end_regn_dt?: string | null;
  } | null;
  regn_url?: string | null;
};

type UnstopSearchResponse = {
  data?: {
    data?: UnstopOpportunity[];
    last_page?: number;
  };
};

function isHackathonType(
  item: UnstopOpportunity,
): boolean {
  return item.type === "hackathons";
}

function isLowQualitySubtype(
  subtype?: string | null,
): boolean {
  if (!subtype) {
    return false;
  }

  const lower = subtype.toLowerCase();

  return (
    lower.includes("quiz") ||
    lower.includes("hiring") ||
    lower.includes("job")
  );
}

function buildUnstopLocation(
  item: UnstopOpportunity,
): string {
  if (item.location?.trim()) {
    return item.location.trim();
  }

  const orgName =
    item.organisation?.name ?? "";
  const festival = item.festival ?? "";
  const fromUrl = item.public_url ?? "";

  if (
    /bangalore|bengaluru/i.test(
      `${orgName} ${festival} ${fromUrl}`,
    )
  ) {
    return "Bengaluru, Karnataka";
  }

  if (item.region === "online") {
    return "Online";
  }

  return orgName || "India";
}

export function normalizeUnstopEvent(
  item: UnstopOpportunity,
): EventIntelligenceInsert {
  const source_url = `https://unstop.com/${item.public_url}`;

  const registration_link =
    item.regn_url?.trim() ||
    item.web_url?.trim() ||
    source_url;

  const seo = item.seo_details?.[0];
  const descriptionText =
    seo?.description ?? "";

  const short_description =
    buildShortFromText(
      seo?.title,
      descriptionText,
      item.title,
    );

  const full_description = buildFullFromText(
    descriptionText,
    item.festival
      ? `Festival: ${item.festival}`
      : undefined,
    item.organisation?.name
      ? `Organizer: ${item.organisation.name}`
      : undefined,
  );

  const organizer_name =
    item.organisation?.name?.trim() ??
    null;

  const teamFromApi = {
    min:
      item.regnRequirements
        ?.min_team_size ?? null,
    max:
      item.regnRequirements
        ?.max_team_size ?? null,
  };

  const teamSize =
    teamFromApi.min !== null ||
    teamFromApi.max !== null
      ? teamFromApi
      : extractTeamSizeFromText(
          descriptionText,
        );

  const tags = [
    ...(item.tags ?? []),
    item.festival,
    item.subtype,
  ].filter(
    (tag): tag is string =>
      Boolean(tag?.trim()),
  );

  return {
    title: item.title,
    description: short_description,
    short_description,
    full_description,
    location: buildUnstopLocation(item),
    mode: detectModeFromFlags({
      region: item.region,
      isOnline:
        item.region === "online",
    }),
    latitude: null,
    longitude: null,
    max_team_size: teamSize.max,
    min_team_size: teamSize.min,
    registration_deadline:
      item.regnRequirements
        ?.end_regn_dt ?? null,
    organizer_name,
    organizer_type:
      inferOrganizerTypeFromText(
        organizer_name,
        item.title,
        descriptionText,
        item.public_url,
      ),
    prize_pool:
      item.overall_prizes?.trim() ??
      null,
    tags,
    source_platform: SOURCE_PLATFORMS.UNSTOP,
    registration_link,
    source_url,
    starts_at: item.start_date,
    status: "reviewing",
  };
}

async function fetchUnstopPage(
  page: number,
): Promise<UnstopOpportunity[]> {
  const url = `${UNSTOP_SEARCH_BASE}?opportunity=hackathons&page=${page}&per_page=50`;

  const response = await fetch(url, {
    headers: MIGO_FETCH_HEADERS,
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(
      `Unstop API failed: HTTP ${response.status}`,
    );
  }

  const json =
    (await response.json()) as UnstopSearchResponse;

  return json.data?.data ?? [];
}

async function fetchUnstopEvents(): Promise<SourceFetchResult> {
  const errors: string[] = [];
  const events: EventIntelligenceInsert[] =
    [];

  console.log(
    "[unstop] fetching hackathons…",
  );

  for (
    let page = 1;
    page <= MAX_PAGES;
    page += 1
  ) {
    try {
      const items =
        await fetchUnstopPage(page);

      console.log(
        `[unstop] page ${page}: ${items.length} items`,
      );

      for (const item of items) {
        if (!isHackathonType(item)) {
          continue;
        }

        if (
          isLowQualitySubtype(
            item.subtype,
          )
        ) {
          continue;
        }

        events.push(
          normalizeUnstopEvent(item),
        );
      }

      if (items.length < 50) {
        break;
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unstop page fetch failed";

      errors.push(
        `Unstop page ${page}: ${message}`,
      );
      break;
    }
  }

  return {
    platform: SOURCE_PLATFORMS.UNSTOP,
    events,
    errors,
  };
}

export const unstopSource: EventSourceAdapter =
  {
    id: "unstop",
    platform: SOURCE_PLATFORMS.UNSTOP,
    fetchEvents: fetchUnstopEvents,
  };

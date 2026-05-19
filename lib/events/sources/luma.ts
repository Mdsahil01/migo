import {
  buildFullFromText,
  buildShortFromText,
  detectModeFromFlags,
  inferOrganizerTypeFromText,
} from "@/lib/events/normalize-shared";
import { SOURCE_PLATFORMS } from "@/lib/events/platforms";
import type { EventIntelligenceInsert } from "@/lib/events/types";

import {
  MIGO_FETCH_HEADERS,
  type EventSourceAdapter,
  type SourceFetchResult,
} from "./types";

const LUMA_BENGALURU_URL =
  "https://luma.com/bengaluru";

const TECH_EVENT_PATTERN =
  /hackathon|hack\b|buildathon|ideathon|ai\b|artificial intelligence|machine learning|startup|developer|devrel|dev\s|engineering|product|founder|tech\b|ml\b|genai|llm|cloud|web3|blockchain|open\s?source|builder/i;

type LumaGeo = {
  city?: string;
  city_state?: string;
  region?: string;
  country?: string;
};

type LumaEventCore = {
  name: string;
  start_at: string;
  end_at?: string;
  url: string;
  location_type?: string;
  timezone?: string;
  geo_address_info?: LumaGeo;
  coordinate?: {
    latitude?: number;
    longitude?: number;
  };
  description?: string;
};

type LumaCalendarEntry = {
  event: LumaEventCore;
};

function parseLumaBengaluruEvents(
  html: string,
): LumaCalendarEntry[] {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  );

  if (!match) {
    throw new Error(
      "Could not find __NEXT_DATA__ on Luma Bengaluru page",
    );
  }

  const data = JSON.parse(match[1]);
  const events =
    data?.props?.pageProps?.initialData
      ?.data?.events;

  if (!Array.isArray(events)) {
    throw new Error(
      "Unexpected Luma Bengaluru page structure",
    );
  }

  return events;
}

function isRelevantLumaEvent(
  entry: LumaCalendarEntry,
): boolean {
  const name =
    entry.event?.name ?? "";

  return TECH_EVENT_PATTERN.test(
    name,
  );
}

function buildLumaLocation(
  event: LumaEventCore,
): string {
  const geo = event.geo_address_info;

  if (geo?.city_state?.trim()) {
    return geo.city_state.trim();
  }

  if (geo?.city?.trim()) {
    const region = geo.region
      ? `, ${geo.region}`
      : "";

    return `${geo.city}${region}`;
  }

  if (
    event.location_type ===
    "online"
  ) {
    return "Online";
  }

  return "Bengaluru, Karnataka";
}

export function normalizeLumaEvent(
  entry: LumaCalendarEntry,
): EventIntelligenceInsert {
  const event = entry.event;
  const source_url = `https://lu.ma/${event.url}`;

  const location =
    buildLumaLocation(event);

  const short_description =
    buildShortFromText(
      undefined,
      event.description,
      event.name,
    );

  const full_description = buildFullFromText(
    event.description,
    `Hosted on Luma — ${location}`,
  );

  const isOnline =
    event.location_type ===
      "online" ||
    location.toLowerCase() ===
      "online";

  const tags: string[] = [];

  if (
    /hackathon|hack\b|buildathon/i.test(
      event.name,
    )
  ) {
    tags.push("Hackathon");
  }

  if (/ai|ml|genai|llm/i.test(event.name)) {
    tags.push("AI");
  }

  if (/startup|founder/i.test(event.name)) {
    tags.push("Startup");
  }

  return {
    title: event.name,
    description: short_description,
    short_description,
    full_description,
    location,
    mode: detectModeFromFlags({
      isOnline,
    }),
    latitude:
      event.coordinate?.latitude ??
      null,
    longitude:
      event.coordinate?.longitude ??
      null,
    max_team_size: null,
    min_team_size: null,
    registration_deadline:
      event.end_at ?? null,
    organizer_name: null,
    organizer_type:
      inferOrganizerTypeFromText(
        event.name,
        event.description,
        location,
      ),
    prize_pool: null,
    tags,
    source_platform: SOURCE_PLATFORMS.LUMA,
    registration_link: source_url,
    source_url,
    starts_at: event.start_at,
    status: "reviewing",
  };
}

async function fetchLumaEvents(): Promise<SourceFetchResult> {
  const errors: string[] = [];
  const events: EventIntelligenceInsert[] =
    [];

  console.log(
    "[luma] fetching Bengaluru calendar…",
  );

  const response = await fetch(
    LUMA_BENGALURU_URL,
    {
      headers: MIGO_FETCH_HEADERS,
      next: { revalidate: 0 },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Luma Bengaluru fetch failed: HTTP ${response.status}`,
    );
  }

  const html = await response.text();
  const entries =
    parseLumaBengaluruEvents(html);

  console.log(
    `[luma] parsed ${entries.length} Bengaluru events`,
  );

  for (const entry of entries) {
    if (!isRelevantLumaEvent(entry)) {
      continue;
    }

    try {
      events.push(
        normalizeLumaEvent(entry),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "normalize failed";

      errors.push(
        `Luma: ${entry.event?.name ?? "event"} — ${message}`,
      );
    }
  }

  return {
    platform: SOURCE_PLATFORMS.LUMA,
    events,
    errors,
  };
}

export const lumaSource: EventSourceAdapter =
  {
    id: "luma",
    platform: SOURCE_PLATFORMS.LUMA,
    fetchEvents: fetchLumaEvents,
  };

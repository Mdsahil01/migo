import { NextResponse } from "next/server";

import { normalizeDevfolioEvent } from "@/lib/events/devfolio-normalize";
import type {
  DevfolioHackathonDetail,
  DevfolioListHackathon,
  EventIntelligenceInsert,
} from "@/lib/events/types";
import { supabase } from "@/lib/supabase";

const DEVFOLIO_EXPLORE_URL =
  "https://devfolio.co/explore";

const DEVFOLIO_API_BASE =
  "https://api.devfolio.co/api/hackathons";

const FETCH_HEADERS = {
  "User-Agent":
    "MIGO-Devfolio-Ingest/1.0 (+https://migo)",
  Accept:
    "text/html,application/json",
};

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
      headers: FETCH_HEADERS,
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

async function loadExistingUrls(): Promise<{
  registrationLinks: Set<string>;
  sourceUrls: Set<string>;
}> {
  const { data, error } =
    await supabase
      .from("events")
      .select(
        "registration_link, source_url",
      );

  if (error) {
    throw new Error(
      `Failed to load existing events: ${error.message}`,
    );
  }

  const registrationLinks =
    new Set<string>();
  const sourceUrls =
    new Set<string>();

  for (const row of data ?? []) {
    if (row.registration_link) {
      registrationLinks.add(
        row.registration_link,
      );
    }
    if (row.source_url) {
      sourceUrls.add(
        row.source_url,
      );
    }
  }

  return {
    registrationLinks,
    sourceUrls,
  };
}

function isDuplicate(
  event: Pick<
    EventIntelligenceInsert,
    "registration_link" | "source_url"
  >,
  existing: {
    registrationLinks: Set<string>;
    sourceUrls: Set<string>;
  },
): boolean {
  return (
    existing.registrationLinks.has(
      event.registration_link,
    ) ||
    existing.sourceUrls.has(
      event.source_url,
    )
  );
}

export async function GET() {
  return runIngestion();
}

export async function POST() {
  return runIngestion();
}

async function runIngestion() {
  const errors: string[] = [];
  let inserted = 0;
  let skippedDuplicates = 0;

  try {
    console.log(
      "[devfolio] fetching explore page…",
    );

    const exploreResponse =
      await fetch(
        DEVFOLIO_EXPLORE_URL,
        {
          headers: FETCH_HEADERS,
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

    console.log(
      "[devfolio] explore page fetched successfully",
    );

    const listHackathons =
      parseExploreHackathons(
        exploreHtml,
      );

    console.log(
      `[devfolio] parsed ${listHackathons.length} unique hackathons from explore`,
    );

    const existing =
      await loadExistingUrls();

    for (const listItem of listHackathons) {
      const detail =
        await fetchHackathonDetail(
          listItem.slug,
        );

      if (!detail) {
        errors.push(
          `Failed to fetch details for slug: ${listItem.slug}`,
        );
        continue;
      }

      const event =
        normalizeDevfolioEvent(
          listItem,
          detail,
        );

      console.log(
        `[devfolio] normalized: ${event.title} [${event.mode}] tags=${event.tags.length}`,
      );

      if (
        isDuplicate(
          event,
          existing,
        )
      ) {
        skippedDuplicates += 1;
        console.log(
          `[devfolio] skipped duplicate: ${event.title} (${event.source_url})`,
        );
        continue;
      }

      const { error } =
        await supabase
          .from("events")
          .insert([event]);

      if (error) {
        const message = `Insert failed for ${event.title}: ${error.message}`;
        errors.push(message);
        console.error(
          `[devfolio] ${message}`,
        );
        continue;
      }

      inserted += 1;
      existing.registrationLinks.add(
        event.registration_link,
      );
      existing.sourceUrls.add(
        event.source_url,
      );

      console.log(
        `[devfolio] inserted event: ${event.title}`,
      );
    }

    console.log(
      `[devfolio] ingestion complete — inserted: ${inserted}, skipped duplicates: ${skippedDuplicates}, errors: ${errors.length}`,
    );

    return NextResponse.json({
      inserted,
      skippedDuplicates,
      errors,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown ingestion error";

    console.error(
      `[devfolio] ingestion failed: ${message}`,
    );

    return NextResponse.json(
      {
        inserted,
        skippedDuplicates,
        errors: [...errors, message],
      },
      { status: 500 },
    );
  }
}

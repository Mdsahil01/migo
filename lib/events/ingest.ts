import { eventSources } from "@/lib/events/sources";
import {
  passesBangaloreNetworkFilter,
  scoreEventRelevance,
} from "@/lib/events/relevance";
import type { EventIntelligenceInsert } from "@/lib/events/types";
import { supabase } from "@/lib/supabase";

export type IngestSourceStats = {
  fetched: number;
  inserted: number;
  skippedDuplicates: number;
  skippedLowRelevance: number;
};

export type IngestPipelineResult = {
  inserted: number;
  skippedDuplicates: number;
  skippedLowRelevance: number;
  errors: string[];
  bySource: Record<
    string,
    IngestSourceStats
  >;
};

export type ExistingUrlIndex = {
  registrationLinks: Set<string>;
  sourceUrls: Set<string>;
};

export async function loadExistingUrlIndex(): Promise<ExistingUrlIndex> {
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
  existing: ExistingUrlIndex,
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

function emptySourceStats(): IngestSourceStats {
  return {
    fetched: 0,
    inserted: 0,
    skippedDuplicates: 0,
    skippedLowRelevance: 0,
  };
}

export async function runIngestionPipeline(): Promise<IngestPipelineResult> {
  const errors: string[] = [];
  const bySource: Record<
    string,
    IngestSourceStats
  > = {};

  let inserted = 0;
  let skippedDuplicates = 0;
  let skippedLowRelevance = 0;

  const existing =
    await loadExistingUrlIndex();

  for (const source of eventSources) {
    const stats =
      emptySourceStats();

    console.log(
      `[ingest] running source: ${source.platform}`,
    );

    try {
      const result =
        await source.fetchEvents();

      stats.fetched =
        result.events.length;
      errors.push(...result.errors);

      for (const event of result.events) {
        const relevance =
          scoreEventRelevance(event);

        if (
          !passesBangaloreNetworkFilter(
            event,
          )
        ) {
          stats.skippedLowRelevance += 1;
          skippedLowRelevance += 1;

          console.log(
            `[ingest] filtered low relevance (${relevance.score}): ${event.title} [${source.platform}]`,
          );
          continue;
        }

        if (
          isDuplicate(
            event,
            existing,
          )
        ) {
          stats.skippedDuplicates += 1;
          skippedDuplicates += 1;

          console.log(
            `[ingest] skipped duplicate: ${event.title} [${source.platform}]`,
          );
          continue;
        }

        const { error: insertError } =
          await supabase
            .from("events")
            .insert([event]);

        if (insertError) {
          const message = `Insert failed for ${event.title} [${source.platform}]: ${insertError.message}`;
          errors.push(message);
          console.error(
            `[ingest] ${message}`,
          );
          continue;
        }

        stats.inserted += 1;
        inserted += 1;

        existing.registrationLinks.add(
          event.registration_link,
        );
        existing.sourceUrls.add(
          event.source_url,
        );

        console.log(
          `[ingest] inserted (${relevance.score}): ${event.title} [${source.platform}]`,
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `${source.platform} ingestion failed`;

      errors.push(
        `${source.platform}: ${message}`,
      );

      console.error(
        `[ingest] source failed: ${source.platform}`,
        error,
      );
    }

    bySource[source.platform] = stats;
  }

  console.log(
    `[ingest] complete — inserted: ${inserted}, duplicates: ${skippedDuplicates}, filtered: ${skippedLowRelevance}, errors: ${errors.length}`,
  );

  return {
    inserted,
    skippedDuplicates,
    skippedLowRelevance,
    errors,
    bySource,
  };
}

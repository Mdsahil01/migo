import { NextResponse } from "next/server";

import { runIngestionPipeline } from "@/lib/events/ingest";

export async function GET() {
  return runIngestHandler();
}

export async function POST() {
  return runIngestHandler();
}

async function runIngestHandler() {
  try {
    const result =
      await runIngestionPipeline();

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown ingestion error";

    console.error(
      `[ingest] pipeline failed: ${message}`,
    );

    return NextResponse.json(
      {
        inserted: 0,
        skippedDuplicates: 0,
        skippedLowRelevance: 0,
        errors: [message],
        bySource: {},
      },
      { status: 500 },
    );
  }
}

import type { EventIntelligenceInsert } from "@/lib/events/types";

export type SourceFetchResult = {
  platform: string;
  events: EventIntelligenceInsert[];
  errors: string[];
};

export type EventSourceAdapter = {
  id: string;
  platform: string;
  fetchEvents: () => Promise<SourceFetchResult>;
};

export const MIGO_FETCH_HEADERS = {
  "User-Agent":
    "MIGO-Intelligence-Network/1.0 (+https://migo)",
  Accept:
    "text/html,application/json",
};

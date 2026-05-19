import { devfolioSource } from "@/lib/events/sources/devfolio";
import { lumaSource } from "@/lib/events/sources/luma";
import { unstopSource } from "@/lib/events/sources/unstop";

import type { EventSourceAdapter } from "./types";

/** Registered ingestion sources — add Devpost, Meetup, etc. here. */
export const eventSources: EventSourceAdapter[] =
  [
    devfolioSource,
    unstopSource,
    lumaSource,
  ];

export {
  devfolioSource,
  unstopSource,
  lumaSource,
};

"use client";

import { EventProvider } from "@/context/event-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <EventProvider>{children}</EventProvider>;
}


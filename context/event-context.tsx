"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { mockHackathonEvents, type HackathonEvent } from "@/data/mock-events";

type EventContextValue = {
  events: HackathonEvent[];
  getEventById: (eventId: string) => HackathonEvent | undefined;
  approveEvent: (eventId: string) => void;
  markAddedToCalendar: (eventId: string) => void;
  updateRegistrationStatus: (
    eventId: string,
    status: HackathonEvent["registrationStatus"],
  ) => void;
};

const EventContext = createContext<EventContextValue | null>(null);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<HackathonEvent[]>(mockHackathonEvents);

  const value = useMemo<EventContextValue>(() => {
    const getEventById = (eventId: string) =>
      events.find((event) => event.id === eventId);

    const approveEvent = (eventId: string) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, approved: true } : event,
        ),
      );
    };

    const markAddedToCalendar = (eventId: string) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, addedToCalendar: true } : event,
        ),
      );
    };

    const updateRegistrationStatus = (
      eventId: string,
      status: HackathonEvent["registrationStatus"],
    ) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, registrationStatus: status } : event,
        ),
      );
    };

    return {
      events,
      getEventById,
      approveEvent,
      markAddedToCalendar,
      updateRegistrationStatus,
    };
  }, [events]);

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEventContext() {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error("useEventContext must be used within EventProvider");
  }

  return context;
}


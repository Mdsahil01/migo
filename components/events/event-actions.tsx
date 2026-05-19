"use client";

import { useState } from "react";

type EventActionsProps = {
    eventId: string;
    title: string;
    location: string;
    starts_at: string;
    registration_link?: string;
  };

  export function EventActions({
    eventId,
    title,
    location,
    starts_at,
    registration_link,
  }: EventActionsProps) {
  const [loading, setLoading] =
    useState(false);

  const updateStatus = async (
    status: string,
  ) => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/update-event-status",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            eventId,
            status,
            title,
            location,
            starts_at,
            registration_link,
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "Failed to update mission",
        );

        return;
      }

      alert(
        `Mission marked as ${status}`,
      );

      window.location.reload();
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <button
        disabled={loading}
        onClick={() =>
          updateStatus(
            "approved",
          )
        }
        className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-50"
      >
        Approve Mission
      </button>

      <button
        disabled={loading}
        onClick={() =>
          updateStatus(
            "rejected",
          )
        }
        className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/20 disabled:opacity-50"
      >
        Reject
      </button>

      <button
        disabled={loading}
        className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:opacity-50"
      >
        Add To Calendar
      </button>
    </div>
  );
}
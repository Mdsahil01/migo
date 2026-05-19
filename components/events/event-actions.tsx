"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

type EventActionsProps = {
  eventId: string;
  title: string;
  location: string;
  starts_at: string;
  registration_link?: string;
  resources?: string;
};

export function EventActions({
  eventId,
  title,
  location,
  starts_at,
  registration_link,
  resources,
}: EventActionsProps) {
  const router = useRouter();

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

  const prepareMission =
    async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/add-to-calendar",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                eventId,
                title,
                location,
                starts_at,
                registration_link,
                resources,
              }),
            },
          );

        const result =
          await response.json();

        if (!response.ok) {
          alert(
            result.error ||
              "Failed to prepare mission",
          );

          return;
        }

        alert(
          "Mission preparation synced successfully.",
        );

        window.location.reload();
      } catch (error) {
        alert(
          "Something went wrong.",
        );
      } finally {
        setLoading(false);
      }
    };

  const deleteMission = async () => {
    const confirmed = window.confirm(
      `Delete "${title}" permanently?\n\nThis mission will be removed from the operational pipeline. This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/delete-event",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            eventId,
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "Failed to delete mission",
        );

        return;
      }

      router.push("/events");
      router.refresh();
    } catch {
      alert(
        "Something went wrong while deleting the mission.",
      );
    } finally {
      setLoading(false);
    }
  };

  const addToGoogleCalendar =
    () => {
      const startDate =
        new Date(starts_at)
          .toISOString()
          .replace(
            /[-:]|\.\d+/g,
            "",
          );

      const endDate =
        new Date(
          new Date(
            starts_at,
          ).getTime() +
            2 *
              60 *
              60 *
              1000,
        )
          .toISOString()
          .replace(
            /[-:]|\.\d+/g,
            "",
          );

      const calendarUrl =
        `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
          title,
        )}&details=${encodeURIComponent(
          resources ||
            "MIGO Mission",
        )}&location=${encodeURIComponent(
          location,
        )}&dates=${startDate}/${endDate}`;

      window.open(
        calendarUrl,
        "_blank",
      );
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
        onClick={prepareMission}
        className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:opacity-50"
      >
        Prepare Mission
      </button>

      <button
        onClick={
          addToGoogleCalendar
        }
        disabled={loading}
        className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
      >
        Add To Google Calendar
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={deleteMission}
        className="rounded-xl border border-red-600/40 bg-red-950/40 px-5 py-3 text-sm font-semibold text-red-200 transition hover:border-red-500/50 hover:bg-red-900/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Delete Mission
      </button>
    </div>
  );
}
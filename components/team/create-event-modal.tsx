"use client";

import { useState } from "react";

type CreateEventModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateEventModal({
  open,
  onClose,
}: CreateEventModalProps) {
  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [location, setLocation] =
    useState("");

  const [startsAt, setStartsAt] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  if (!open) return null;

  const onSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "/api/create-event",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            location,
            starts_at: startsAt,
            status: "approved",
            created_by: "MIGO Team",
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "Failed to create event",
        );

        return;
      }

      alert(
        "Mission created successfully.",
      );

      window.location.reload();
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white">
          Create Mission
        </h2>

        <form
          onSubmit={onSubmit}
          className="mt-6 space-y-4"
        >
          <input
            type="text"
            placeholder="Mission title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
            required
          />

          <textarea
            placeholder="Mission description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value,
              )
            }
            className="h-32 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value,
              )
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
            required
          />

          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) =>
              setStartsAt(
                e.target.value,
              )
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-zinc-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-cyan-400 px-5 py-2 font-semibold text-black"
            >
              {loading
                ? "Creating..."
                : "Create Mission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
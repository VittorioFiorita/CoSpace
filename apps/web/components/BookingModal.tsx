"use client";

import { useState } from "react";
import { useCreateBooking } from "@/lib/queries";
import { type Space } from "@/lib/api";

export function BookingModal({
  space,
  onClose,
  onCreated,
}: {
  space: Space;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const createBooking = useCreateBooking();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createBooking.mutate(
      {
        space_id: space.id,
        start_time: `${date}T${startTime}:00`,
        end_time: `${date}T${endTime}:00`,
      },
      { onSuccess: onCreated }
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-bg-card border border-border rounded-2xl p-6"
      >
        <div className="font-heading text-lg font-bold text-text mb-1">Prenota {space.name}</div>
        <div className="text-sm text-text-secondary mb-4">{space.capacity} posti</div>

        {createBooking.isError && (
          <div className="mb-3 text-sm text-red-600">
            {createBooking.error instanceof Error ? createBooking.error.message : "Errore imprevisto"}
          </div>
        )}

        <label className="block text-sm font-medium text-text-secondary mb-1">Data</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full mb-3 rounded-lg border border-border bg-bg-page px-3 py-2 text-text"
        />

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-secondary mb-1">Inizio</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-bg-page px-3 py-2 text-text"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-secondary mb-1">Fine</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-bg-page px-3 py-2 text-text"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-border py-2 text-text text-sm font-semibold"
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={createBooking.isPending}
            className="flex-1 rounded-lg bg-accent text-white py-2 text-sm font-semibold disabled:opacity-60"
          >
            {createBooking.isPending ? "Prenoto…" : "Prenota"}
          </button>
        </div>
      </form>
    </div>
  );
}
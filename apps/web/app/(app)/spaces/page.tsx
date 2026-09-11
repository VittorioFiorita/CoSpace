"use client";

import { useEffect, useState, useCallback } from "react";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { getSpaces, getMyBookings, type Space, type Booking } from "@/lib/api";
import { BookingModal } from "@/components/BookingModal";

export default function SpacesPage() {
  const { token, ready } = useRequireAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  const loadData = useCallback(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([getSpaces(token), getMyBookings(token)])
        .then(([s, b]) => {
        setSpaces(s);
        setBookings(b);
        })
        .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  function isOccupiedNow(spaceId: number) {
    const now = new Date();
    return bookings.some(
      (b) =>
        b.space_id === spaceId &&
        b.status === "confirmed" &&
        new Date(b.start_time) <= now &&
        new Date(b.end_time) > now
    );
  }

  if (!ready || loading) {
    return (
      <div className="p-9 text-text">Caricamento…</div>
    );
  }

  return (
    <>
      <div className="flex-1 p-9">
        <div className="font-heading text-2xl font-bold text-text mb-1">Spazi</div>
        <div className="text-sm text-text-secondary mb-6">
          Tutti gli spazi disponibili nel coworking.
        </div>

        <div className="grid grid-cols-3 gap-4">
          {spaces.map((space) => {
            const occupied = isOccupiedNow(space.id);
            return (
              <div key={space.id} className="bg-bg-card border border-border rounded-2xl p-5">
                <div className="text-sm font-semibold text-text mb-1">{space.name}</div>
                <div className="text-xs text-text-secondary mb-3">
                  {space.space_type === "meeting_room" ? `${space.capacity} posti` : "Scrivania"}
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block mb-3 ${
                    occupied
                      ? "bg-bg-page border border-border text-text-secondary"
                      : "bg-good-soft text-good"
                  }`}
                >
                  {occupied ? "Occupato ora" : "Libero ora"}
                </span>
                <button
                  onClick={() => setSelectedSpace(space)}
                  className="w-full rounded-lg bg-accent text-white py-2 text-sm font-semibold"
                >
                  Prenota
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedSpace && (
        <BookingModal
          space={selectedSpace}
          onClose={() => setSelectedSpace(null)}
          onCreated={() => {
            setSelectedSpace(null);
            loadData();
          }}
        />
      )}
    </>
  );
}
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { getSpaces, getMyBookings, cancelBooking, type Space, type Booking } from "@/lib/api";
import { Sidebar } from "@/components/Sidebar";

export default function BookingsPage() {
  const { token, ready } = useRequireAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

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

  async function handleCancel(id: number) {
    if (!token) return;
    setCancellingId(id);
    try {
      await cancelBooking(token, id);
      loadData();
    } finally {
      setCancellingId(null);
    }
  }

  function spaceName(id: number) {
    return spaces.find((s) => s.id === id)?.name ?? "Spazio";
  }

  if (!ready || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-page text-text">
        Caricamento…
      </div>
    );
  }

  const sorted = [...bookings].sort(
    (a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
  );

  return (
    <div className="min-h-screen flex bg-bg-page">
      <Sidebar />
      <div className="flex-1 p-9">
        <div className="font-heading text-2xl font-bold text-text mb-1">Prenotazioni</div>
        <div className="text-sm text-text-secondary mb-6">Tutte le tue prenotazioni.</div>

        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
          {sorted.length === 0 ? (
            <div className="p-6 text-sm text-text-secondary">Nessuna prenotazione ancora.</div>
          ) : (
            sorted.map((b, i) => (
              <div
                key={b.id}
                className={`flex items-center justify-between px-5 py-4 ${
                  i < sorted.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div>
                  <div className="text-sm font-semibold text-text">{spaceName(b.space_id)}</div>
                  <div className="text-xs text-text-secondary">
                    {new Date(b.start_time).toLocaleDateString("it-IT")}{" "}
                    {new Date(b.start_time).toLocaleTimeString("it-IT", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" – "}
                    {new Date(b.end_time).toLocaleTimeString("it-IT", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      b.status === "confirmed"
                        ? "bg-good-soft text-good"
                        : "bg-bg-page border border-border text-text-secondary"
                    }`}
                  >
                    {b.status === "confirmed" ? "Confermata" : "Cancellata"}
                  </span>
                  {b.status === "confirmed" && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      disabled={cancellingId === b.id}
                      className="text-xs font-semibold text-red-600 disabled:opacity-60"
                    >
                      {cancellingId === b.id ? "…" : "Cancella"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
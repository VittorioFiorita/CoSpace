"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getSpaces, getMyBookings, type Space, type Booking } from "@/lib/api";
import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { WeekCalendarCard } from "@/components/WeekCalendarCard";
import { SpacesListCard } from "@/components/SpacesListCard";

export default function DashboardPage() {
  const { token, isReady } = useAuth();
  const router = useRouter();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady && !token) {
      router.push("/login");
    }
  }, [isReady, token, router]);

  useEffect(() => {
    if (!token) return;
    Promise.all([getSpaces(token), getMyBookings(token)])
      .then(([s, b]) => {
        setSpaces(s);
        setBookings(b);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (!isReady || loading || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-page text-text">
        Caricamento…
      </div>
    );
  }

  const now = new Date();
  const occupiedCount = spaces.filter((s) =>
    bookings.some(
      (b) =>
        b.space_id === s.id &&
        b.status === "confirmed" &&
        new Date(b.start_time) <= now &&
        new Date(b.end_time) > now
    )
  ).length;

  return (
    <div className="min-h-screen flex bg-bg-page">
      <Sidebar />
      <div className="flex-1 p-9">
        <div className="font-heading text-2xl font-bold text-text mb-1">Dashboard</div>
        <div className="text-sm text-text-secondary mb-6">Ecco lo stato dello spazio oggi.</div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard label="Spazi disponibili oggi" value={spaces.length - occupiedCount} />
          <StatCard
            label="Le tue prenotazioni"
            value={bookings.filter((b) => b.status === "confirmed").length}
          />
          <StatCard
            label="Tasso di occupazione"
            value={spaces.length > 0 ? `${Math.round((occupiedCount / spaces.length) * 100)}%` : "0%"}
            accent
          />
        </div>

        <div className="grid grid-cols-[1.6fr_1fr] gap-4">
          <WeekCalendarCard bookings={bookings} spaces={spaces} />
          <SpacesListCard spaces={spaces} bookings={bookings} />
        </div>
      </div>
    </div>
  );
}
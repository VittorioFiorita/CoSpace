"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { getAllBookings, getSpaces, type Space, type Booking } from "@/lib/api";
import { UserManagementCard } from "@/components/UserManagementCard";

export default function AnalyticsPage() {
  const { token, ready } = useRequireAuth("staff");
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([getSpaces(token), getAllBookings(token)])
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

  const trendData = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" });
      const count = bookings.filter(
        (b) =>
          b.status === "confirmed" &&
          new Date(b.start_time).toDateString() === d.toDateString()
      ).length;
      days.push({ date: label, count });
    }
    return days;
  }, [bookings]);

  const perSpaceData = useMemo(() => {
    return spaces.map((s) => ({
      name: s.name,
      count: bookings.filter((b) => b.space_id === s.id && b.status === "confirmed").length,
    }));
  }, [spaces, bookings]);

  if (!ready || loading) {
    return (
      <div className="p-9 text-text">Caricamento…</div>
    );
  }

  return (
      <div className="flex-1 p-9">
        <div className="font-heading text-2xl font-bold text-text mb-1">Analytics</div>
        <div className="text-sm text-text-secondary mb-6">
          Panoramica delle prenotazioni su tutto il coworking.
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg-card border border-border rounded-2xl p-5">
            <div className="font-bold text-[15px] text-text mb-4">
              Prenotazioni negli ultimi 14 giorni
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="var(--accent)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-bg-card border border-border rounded-2xl p-5">
            <div className="font-bold text-[15px] text-text mb-4">Prenotazioni per spazio</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={perSpaceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-4">
          <UserManagementCard />
        </div>
      </div>
  );
}
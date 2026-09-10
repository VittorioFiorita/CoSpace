import type { Space, Booking } from "@/lib/api";

function getWeekDays(): Date[] {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

const DAY_LABELS = ["LUN", "MAR", "MER", "GIO", "VEN"];

function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

export function WeekCalendarCard({ bookings, spaces }: { bookings: Booking[]; spaces: Space[] }) {
  const days = getWeekDays();
  const spaceName = (id: number) => spaces.find((s) => s.id === id)?.name ?? "Spazio";

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-5">
      <div className="font-bold text-[15px] text-text mb-4">Questa settimana</div>
      <div className="grid grid-cols-5 gap-2.5">
        {days.map((day, i) => {
          const dayBookings = bookings.filter(
            (b) => b.status === "confirmed" && sameDay(new Date(b.start_time), day)
          );
          return (
            <div key={i}>
              <div className="text-xs font-semibold text-text-secondary mb-2">
                {DAY_LABELS[i]} {day.getDate()}
              </div>
              {dayBookings.length === 0 ? (
                <div className="border border-dashed border-border rounded-lg px-2 py-2 text-xs text-text-secondary">
                  Libero
                </div>
              ) : (
                dayBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-accent-soft text-accent rounded-lg px-2 py-2 text-xs font-semibold mb-1.5"
                  >
                    {spaceName(b.space_id)} ·{" "}
                    {new Date(b.start_time).toLocaleTimeString("it-IT", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
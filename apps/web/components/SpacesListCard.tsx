import type { Space, Booking } from "@/lib/api";

function isOccupiedNow(spaceId: number, bookings: Booking[]) {
  const now = new Date();
  return bookings.some(
    (b) =>
      b.space_id === spaceId &&
      b.status === "confirmed" &&
      new Date(b.start_time) <= now &&
      new Date(b.end_time) > now
  );
}

export function SpacesListCard({ spaces, bookings }: { spaces: Space[]; bookings: Booking[] }) {
  return (
    <div className="bg-bg-card border border-border rounded-2xl p-5">
      <div className="font-bold text-[15px] mb-4 text-text">Spazi disponibili</div>
      <div className="flex flex-col">
        {spaces.map((space, i) => {
          const occupied = isOccupiedNow(space.id, bookings);
          return (
            <div
              key={space.id}
              className={`flex items-center justify-between py-3 ${
                i < spaces.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div>
                <div className="text-sm font-semibold text-text">{space.name}</div>
                <div className="text-xs text-text-secondary">
                  {space.space_type === "meeting_room"
                    ? `${space.capacity} posti`
                    : space.space_type === "desk"
                    ? "Scrivania"
                    : space.space_type}
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  occupied
                    ? "bg-bg-page border border-border text-text-secondary"
                    : "bg-good-soft text-good"
                }`}
              >
                {occupied ? "Occupato" : "Libero"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
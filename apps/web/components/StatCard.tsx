export function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        accent ? "bg-accent-soft" : "bg-bg-card border border-border"
      }`}
    >
      <div className={`text-sm mb-2 ${accent ? "text-accent font-semibold" : "text-text-secondary"}`}>
        {label}
      </div>
      <div className={`text-2xl font-bold ${accent ? "text-accent" : "text-text"}`}>{value}</div>
    </div>
  );
}
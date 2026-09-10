import { LogoutButton } from "@/components/LogoutButton";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page">
      <div className="text-center">
        <p className="font-heading text-2xl text-text mb-4">Sei dentro 🎉</p>
        <LogoutButton />
      </div>
    </div>
  );
}
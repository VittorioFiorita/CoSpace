import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-bg-page">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
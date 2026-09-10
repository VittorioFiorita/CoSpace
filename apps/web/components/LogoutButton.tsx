"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        logout();
        router.push("/login");
      }}
      className="rounded-lg border border-border px-4 py-2 text-text"
    >
      Esci
    </button>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/bookings", label: "Prenotazioni" },
  { href: "/spaces", label: "Spazi" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored === "dark" || (stored === null && prefersDark);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (shouldBeDark) setDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="w-59 shrink-0 bg-sidebar border-r border-border flex flex-col p-4">
      <div className="font-heading font-bold text-xl px-3 pt-1 pb-7">CoSpace</div>

      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                active ? "bg-accent-soft text-accent" : "text-text-secondary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <button
        onClick={() => setDark((d) => !d)}
        className="flex items-center justify-between px-3 py-2 mb-2 text-sm text-text-secondary"
      >
        <span>Tema scuro</span>
        <span
          className={`w-8.5 h-4.75 rounded-full relative transition-colors ${
            dark ? "bg-accent" : "bg-border"
          }`}
        >
          <span
            className={`w-3.75 h-3.75 rounded-full bg-bg-card absolute top-0.5 transition-all ${
              dark ? "left-4.25" : "left-0.5"
            }`}
          />
        </span>
      </button>

      <button
        onClick={logout}
        className="text-left px-3 py-2 rounded-lg border border-border text-sm text-text"
      >
        Esci
      </button>
    </div>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  DashboardIcon,
  BookingsIcon,
  SpacesIcon,
  AssistantIcon,
  AnalyticsIcon,
  LogoutIcon,
  SunIcon,
  MoonIcon,
} from "@/components/icons";



export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [dark, setDark] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
    { href: "/bookings", label: "Prenotazioni", icon: BookingsIcon },
    { href: "/spaces", label: "Spazi", icon: SpacesIcon },
    { href: "/assistant", label: "Assistente", icon: AssistantIcon },
    ...(user && ["admin", "staff"].includes(user.role)
      ? [{ href: "/admin/analytics", label: "Analytics", icon: AnalyticsIcon }]
      : []),
  ];

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
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                active ? "bg-accent-soft text-accent" : "text-text-secondary"
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
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
        <span className="flex items-center gap-2.5">
          {dark ? <MoonIcon className="w-4.5 h-4.5" /> : <SunIcon className="w-4.5 h-4.5" />}
          Tema scuro
        </span>
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
        className="flex items-center gap-2.5 text-left px-3 py-2 rounded-lg border border-border text-sm text-text"
      >
        <LogoutIcon className="w-4.5 h-4.5" />
        Esci
      </button>
    </div>
  );
}
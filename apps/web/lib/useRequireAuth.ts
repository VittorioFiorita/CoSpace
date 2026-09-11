"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

const STAFF_ROLES = ["admin", "staff"];

export function useRequireAuth(requiredRole?: "staff") {
  const { token, user, isReady } = useAuth();
  const router = useRouter();

  const hasRole = !requiredRole || (user ? STAFF_ROLES.includes(user.role) : false);

  useEffect(() => {
    if (!isReady) return;
    if (!token) {
      router.push("/login");
      return;
    }
    if (user && !hasRole) {
      router.push("/dashboard");
    }
  }, [isReady, token, user, hasRole, router])

  return { token, user, ready: isReady && !!token && hasRole };
}
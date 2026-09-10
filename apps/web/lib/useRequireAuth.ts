"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

export function useRequireAuth() {
  const { token, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !token) {
      router.push("/login");
    }
  }, [isReady, token, router]);

  return { token, ready: isReady && !!token };
}
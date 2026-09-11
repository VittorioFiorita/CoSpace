"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LandingPage } from "@/components/LandingPage";

export default function Home() {
  const { token, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && token) {
      router.push("/dashboard");
    }
  }, [isReady, token, router]);

  if (!isReady || token) {
    return <div className="min-h-screen bg-bg-page" />;
  }

  return <LandingPage />;
}
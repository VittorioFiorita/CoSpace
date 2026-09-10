"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-bg-card border border-border rounded-2xl p-8"
    >
      <h1 className="font-heading text-2xl font-bold mb-6 text-text">Accedi a CoSpace</h1>

      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

      <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full mb-4 rounded-lg border border-border bg-bg-page px-3 py-2 text-text"
      />

      <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full mb-6 rounded-lg border border-border bg-bg-page px-3 py-2 text-text"
      />

      <button type="submit" className="w-full rounded-lg bg-accent text-white py-2 font-semibold">
        Accedi
      </button>
    </form>
  );
}
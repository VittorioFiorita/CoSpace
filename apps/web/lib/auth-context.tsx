"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { login as apiLogin, getMe, type User } from "./api";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const stored = localStorage.getItem("token");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setToken(stored);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(null);
      return;
    }
    getMe(token).then(setUser).catch(() => setUser(null));
  }, [token])

  async function login(email: string, password: string) {
    const data = await apiLogin(email, password);
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    queryClient.clear();
  }

  return (
    <AuthContext.Provider value={{ token, user, isReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
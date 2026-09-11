"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getUsers, updateUserRole, type User } from "@/lib/api";

const ROLES = ["member", "staff", "admin"];

export function UserManagementCard() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadUsers = useCallback(() => {
    if (!token) return;
    setLoading(true);
    getUsers(token)
      .then(setUsers)
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, [loadUsers]);

  async function handleRoleChange(userId: number, role: string) {
    if (!token) return;
    setUpdatingId(userId);
    try {
      await updateUserRole(token, userId, role);
      loadUsers();
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="bg-bg-card border border-border rounded-2xl p-5 text-text-secondary text-sm">
        Caricamento utenti…
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-5 pb-0 font-bold text-[15px] text-text">Gestione utenti</div>
      <div className="p-5">
        {users.map((u, i) => (
          <div
            key={u.id}
            className={`flex items-center justify-between py-3 ${
              i < users.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div>
              <div className="text-sm font-semibold text-text">{u.full_name}</div>
              <div className="text-xs text-text-secondary">{u.email}</div>
            </div>
            <select
              value={u.role}
              onChange={(e) => handleRoleChange(u.id, e.target.value)}
              disabled={updatingId === u.id}
              className="rounded-lg border border-border bg-bg-page px-2 py-1 text-sm text-text disabled:opacity-60"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
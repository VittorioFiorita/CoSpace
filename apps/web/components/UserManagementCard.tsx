"use client";

import { useUsers, useUpdateUserRole } from "@/lib/queries";

const ROLES = ["member", "staff", "admin"];

export function UserManagementCard() {
  const { data: users = [], isLoading } = useUsers();
  const updateRole = useUpdateUserRole();

  if (isLoading) {
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
        {users.map((u, i) => {
          const isUpdating = updateRole.isPending && updateRole.variables?.userId === u.id;
          return (
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
                onChange={(e) => updateRole.mutate({ userId: u.id, role: e.target.value })}
                disabled={isUpdating}
                className="rounded-lg border border-border bg-bg-page px-2 py-1 text-sm text-text disabled:opacity-60"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
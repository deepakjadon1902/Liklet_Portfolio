import { useQuery } from "@tanstack/react-query";
import { AdminEmptyState, AdminPageHeader, AdminStatusPill } from "../AdminUi";
import { adminApiFetch } from "../adminApi";

type UserRow = {
  _id: string;
  name?: string;
  email: string;
  phone?: string;
  role: string;
  isEmailVerified?: boolean;
  createdAt?: string;
};

export default function AdminUsers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminApiFetch<{ users: UserRow[] }>("/users"),
    staleTime: 5_000,
  });

  const users = data?.users ?? [];

  return (
    <div>
      <AdminPageHeader eyebrow="Accounts" title="Users" description="Browse registered users, roles, and verification state." />

      {isLoading ? <div className="admin-panel mb-5 p-5 text-sm font-medium text-black/60">Loading...</div> : null}
      {error ? <div className="admin-panel mb-5 p-5 text-sm font-medium text-black/60">Unable to load users.</div> : null}

      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="admin-table min-w-[680px]">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="font-semibold">{u.name || "-"}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "-"}</td>
                  <td>
                    <AdminStatusPill tone={u.role === "admin" ? "dark" : "neutral"}>{u.role}</AdminStatusPill>
                  </td>
                  <td>
                    <AdminStatusPill tone={u.isEmailVerified ? "blue" : "neutral"}>
                      {u.isEmailVerified ? "Yes" : "No"}
                    </AdminStatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!users.length && !isLoading ? (
        <div className="mt-4">
          <AdminEmptyState>No users.</AdminEmptyState>
        </div>
      ) : null}
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
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
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Users</h1>
      <p className="text-muted-foreground mb-6">Registered users.</p>

      {isLoading ? <div className="text-muted-foreground">Loading…</div> : null}
      {error ? <div className="text-muted-foreground">Unable to load users.</div> : null}

      <div className="card-premium p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Verified</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-border">
                <td className="p-3">{u.name || "-"}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.phone || "-"}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.isEmailVerified ? "Yes" : "No"}</td>
              </tr>
            ))}
            {!users.length && !isLoading ? (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={5}>
                  No users.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}


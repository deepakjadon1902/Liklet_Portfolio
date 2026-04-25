import { useQuery } from "@tanstack/react-query";
import { adminApiFetch } from "../adminApi";

type Stats = { users: number; services: number; orders: number; payments: number };

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminApiFetch<{ ok: boolean; stats: Stats }>("/dashboard"),
    staleTime: 10_000,
  });

  const stats = data?.stats;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-6">Quick overview of the system.</p>

      {isLoading ? <div className="text-muted-foreground">Loading…</div> : null}
      {error ? <div className="text-muted-foreground">Unable to load dashboard.</div> : null}

      {stats ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Users", value: stats.users },
            { label: "Services", value: stats.services },
            { label: "Orders", value: stats.orders },
            { label: "Payments", value: stats.payments },
          ].map((item) => (
            <div key={item.label} className="card-premium p-5">
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="text-3xl font-bold text-foreground mt-2">{item.value}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}


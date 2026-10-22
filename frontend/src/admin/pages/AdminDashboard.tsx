import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AdminMetricCard, AdminPageHeader } from "../AdminUi";
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
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Current account, service, order, and payment totals."
      />

      {isLoading ? (
        <div className="admin-panel p-5 text-sm font-medium text-black/60">Loading...</div>
      ) : null}
      {error ? (
        <div className="admin-panel p-5 text-sm font-medium text-black/60">
          Unable to load dashboard.
        </div>
      ) : null}

      {stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Users", value: stats.users, detail: "Registered accounts" },
            { label: "Services", value: stats.services, detail: "Service catalog entries" },
            { label: "Orders", value: stats.orders, detail: "Customer bookings" },
            { label: "Payments", value: stats.payments, detail: "Payment records" },
          ].map((item) => (
            <AdminMetricCard
              key={item.label}
              label={item.label}
              value={item.value.toLocaleString("en-IN")}
              detail={item.detail}
            />
          ))}
        </div>
      ) : null}

      <div className="mt-6">
        <div className="admin-card p-6">
          <div className="admin-kicker mb-2">Operations</div>
          <h2 className="font-display text-2xl font-bold text-black">Manage your workspace</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { name: "Services", path: "/admin/services", detail: "Edit service information" },
              { name: "Orders", path: "/admin/orders", detail: "Review customer bookings" },
              { name: "Payments", path: "/admin/payments", detail: "View payment records" },
            ].map((item) => (
              <Link
                to={item.path}
                key={item.path}
                className="rounded-lg border border-[#c5c5c5] bg-white p-4 hover:border-accent"
              >
                <div className="text-sm font-semibold text-black">{item.name}</div>
                <div className="mt-3 text-xs font-medium text-black/55">{item.detail}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

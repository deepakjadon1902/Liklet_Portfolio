import { useQuery } from "@tanstack/react-query";
import { Box, CreditCard, PackageCheck, Users } from "lucide-react";
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
        eyebrow="Command overview"
        title="Dashboard"
        description="A sharp snapshot of users, services, orders, and payment activity across the platform."
      />

      {isLoading ? <div className="admin-panel p-5 text-sm font-medium text-black/60">Loading...</div> : null}
      {error ? <div className="admin-panel p-5 text-sm font-medium text-black/60">Unable to load dashboard.</div> : null}

      {stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Users", value: stats.users, detail: "Registered accounts", icon: Users },
            { label: "Services", value: stats.services, detail: "Live service catalog", icon: Box },
            { label: "Orders", value: stats.orders, detail: "Customer bookings", icon: PackageCheck },
            { label: "Payments", value: stats.payments, detail: "Payment records", icon: CreditCard },
          ].map((item) => (
            <AdminMetricCard
              key={item.label}
              label={item.label}
              value={item.value.toLocaleString("en-IN")}
              detail={item.detail}
              icon={<item.icon className="h-5 w-5" />}
            />
          ))}
        </div>
      ) : null}

      <div className="mt-6">
        <div className="admin-card p-6">
          <div className="admin-kicker mb-2">Operations</div>
          <h2 className="font-display text-2xl font-bold text-black">Platform health</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["Catalog", "Orders", "Payments"].map((item) => (
              <div key={item} className="rounded-lg border border-[#c5c5c5] bg-white p-4">
                <div className="text-sm font-semibold text-black">{item}</div>
                <div className="mt-2 h-2 rounded-full bg-[#c5c5c5]">
                  <div className="h-full w-3/4 rounded-full bg-[#4169E1]" />
                </div>
                <div className="mt-3 text-xs font-medium text-black/55">Ready for review</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

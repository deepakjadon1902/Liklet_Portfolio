import { useQuery } from "@tanstack/react-query";
import { adminApiFetch } from "../adminApi";

type OrderRow = {
  _id: string;
  status: string;
  createdAt?: string;
  userId?: { name?: string; email?: string; phone?: string };
  serviceId?: { name?: string; slug?: string; type?: string };
  packageId?: { name?: string; priceInr?: number };
};

export default function AdminOrders() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => adminApiFetch<{ orders: OrderRow[] }>("/orders"),
    staleTime: 2_000,
  });

  const orders = data?.orders ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Orders</h1>
      <p className="text-muted-foreground mb-6">All customer orders.</p>

      {isLoading ? <div className="text-muted-foreground">Loading…</div> : null}
      {error ? <div className="text-muted-foreground">Unable to load orders.</div> : null}

      <div className="card-premium p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="p-3">Date</th>
              <th className="p-3">User</th>
              <th className="p-3">Service</th>
              <th className="p-3">Package</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t border-border">
                <td className="p-3">{o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</td>
                <td className="p-3">{o.userId?.email || "-"}</td>
                <td className="p-3">{o.serviceId?.name || "-"}</td>
                <td className="p-3">{o.packageId?.name || "-"}</td>
                <td className="p-3">{o.status}</td>
              </tr>
            ))}
            {!orders.length && !isLoading ? (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={5}>
                  No orders.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}


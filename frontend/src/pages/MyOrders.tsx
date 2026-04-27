import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/apiClient";
import { Currency, formatMoney } from "@/lib/currency";

type OrderSummary = {
  _id: string;
  status: string;
  createdAt: string;
  serviceName?: string;
  packageName?: string;
  amount?: number;
  currency?: Currency;
};

type LookupResponse = { ok: true; orders: OrderSummary[] };

function getSavedOrders(): Array<{ id: string; token: string }> {
  try {
    const raw = localStorage.getItem("liklet:orders");
    const data = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(data)) return [];
    return data
      .filter((x) => x && typeof x === "object")
      .map((x) => x as { id?: unknown; token?: unknown })
      .filter((x) => typeof x.id === "string" && typeof x.token === "string")
      .map((x) => ({ id: x.id as string, token: x.token as string }));
  } catch {
    return [];
  }
}

export default function MyOrders() {
  const [saved, setSaved] = useState<Array<{ id: string; token: string }>>([]);

  useEffect(() => {
    setSaved(getSavedOrders());
  }, []);

  const lookupBody = useMemo(() => ({ orders: saved }), [saved]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["public-orders-lookup", saved.map((o) => o.id).join(",")],
    enabled: saved.length > 0,
    queryFn: () =>
      apiFetch<LookupResponse>("/public/orders/lookup", {
        method: "POST",
        body: JSON.stringify(lookupBody),
      }),
  });

  const orders = data?.orders ?? [];

  return (
    <div className="overflow-hidden">
      <section className="section-padding pt-28 bg-card">
        <div className="container-max max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-muted-foreground mb-6">
            Orders are stored in this browser after successful payment.
          </p>

          {!saved.length ? (
            <div className="card-premium p-6 text-muted-foreground">
              No orders yet. <Link className="text-accent underline" to="/social-media-marketing">Browse services</Link>
            </div>
          ) : (
            <div className="card-premium p-6">
              {isLoading ? <div className="text-muted-foreground">Loading ordersâ€¦</div> : null}
              {error ? <div className="text-muted-foreground">Unable to load orders.</div> : null}

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Service</th>
                      <th className="py-2 pr-4">Package</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-0">Order ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id} className="border-t border-border">
                        <td className="py-3 pr-4">{new Date(o.createdAt).toLocaleString()}</td>
                        <td className="py-3 pr-4">{o.serviceName || "-"}</td>
                        <td className="py-3 pr-4">{o.packageName || "-"}</td>
                        <td className="py-3 pr-4">
                          {o.amount != null && o.currency ? formatMoney(o.amount, o.currency) : "-"}
                        </td>
                        <td className="py-3 pr-4 capitalize">{o.status}</td>
                        <td className="py-3 pr-0 font-mono text-xs">{o._id}</td>
                      </tr>
                    ))}
                    {!orders.length && !isLoading ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-muted-foreground">
                          No orders found.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


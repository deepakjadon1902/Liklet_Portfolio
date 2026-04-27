import { Fragment, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApiFetch } from "../adminApi";
import { formatMoney, type Currency } from "@/lib/currency";

type OrderRow = {
  _id: string;
  status: string;
  createdAt?: string;
  currency?: Currency;
  amount?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  platformDetails?: { accountLink?: string; accountUsername?: string; notes?: string } | Record<string, unknown>;
  userId?: { name?: string; email?: string; phone?: string };
  serviceId?: { name?: string; slug?: string; type?: string };
  packageId?: { name?: string; priceInr?: number; priceUsd?: number; interval?: string };
  serviceName?: string;
  packageName?: string;
};

export default function AdminOrders() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => adminApiFetch<{ orders: OrderRow[] }>("/orders"),
    staleTime: 2_000,
  });

  const orders = data?.orders ?? [];

  const rows = useMemo(() => {
    return orders.map(
      (o): OrderRow & { serviceLabel: string; packageLabel: string; userLabel: string; amountLabel: string } => {
      const serviceLabel = o.serviceId?.name || o.serviceName || "-";
      const packageLabel = o.packageId?.name || o.packageName || "-";
      const userLabel = o.userId?.email || o.customerEmail || "-";
      const amountLabel =
        o.amount != null && o.currency
          ? formatMoney(Number(o.amount || 0), o.currency)
          : o.amount != null
            ? String(o.amount)
            : "-";

      return { ...o, serviceLabel, packageLabel, userLabel, amountLabel };
      }
    );
  }, [orders]);

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
              <th className="p-3">Booking Info</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <Fragment key={o._id}>
                <tr
                  className="border-t border-border cursor-pointer hover:bg-muted/20"
                  onClick={() => setOpenId((p) => (p === o._id ? null : o._id))}
                  title="Click to view booking details"
                >
                  <td className="p-3">{o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</td>
                  <td className="p-3">{o.userLabel}</td>
                  <td className="p-3">{o.serviceLabel}</td>
                  <td className="p-3">{o.packageLabel}</td>
                  <td className="p-3">
                    <div className="text-sm text-foreground">{o.customerName || "-"}</div>
                    <div className="text-xs text-muted-foreground">
                      {o.customerPhone || "-"}
                      {o.customerEmail ? ` · ${o.customerEmail}` : ""}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(o.platformDetails as { accountUsername?: string } | undefined)?.accountUsername
                        ? `@${(o.platformDetails as { accountUsername?: string }).accountUsername}`
                        : ""}
                    </div>
                  </td>
                  <td className="p-3">{o.amountLabel}</td>
                  <td className="p-3 capitalize">{o.status}</td>
                </tr>
                {openId === o._id ? (
                  <tr className="border-t border-border bg-muted/10">
                    <td className="p-3" colSpan={7}>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Order ID</div>
                          <div className="font-mono text-xs break-all">{o._id}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">User</div>
                          <div className="text-sm">
                            {o.userId?.name ? `${o.userId.name} · ` : ""}
                            {o.userId?.email || "-"}
                            {o.userId?.phone ? ` · ${o.userId.phone}` : ""}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-muted-foreground">Customer (booking form)</div>
                          <div className="text-sm">
                            {o.customerName || "-"}
                            {o.customerEmail ? ` · ${o.customerEmail}` : ""}
                            {o.customerPhone ? ` · ${o.customerPhone}` : ""}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Service / Package</div>
                          <div className="text-sm">
                            {o.serviceLabel} · {o.packageLabel}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-muted-foreground">Amount</div>
                          <div className="text-sm">
                            {o.amount != null && o.currency ? formatMoney(Number(o.amount || 0), o.currency) : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Status</div>
                          <div className="text-sm capitalize">{o.status}</div>
                        </div>

                        <div>
                          <div className="text-xs text-muted-foreground">Account Link</div>
                          <div className="text-sm break-all">
                            {(o.platformDetails as { accountLink?: string } | undefined)?.accountLink || "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Account Username</div>
                          <div className="text-sm">
                            {(o.platformDetails as { accountUsername?: string } | undefined)?.accountUsername || "-"}
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <div className="text-xs text-muted-foreground">Notes</div>
                          <div className="text-sm whitespace-pre-wrap">
                            {(o.platformDetails as { notes?: string } | undefined)?.notes || "-"}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
            {!rows.length && !isLoading ? (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={7}>
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

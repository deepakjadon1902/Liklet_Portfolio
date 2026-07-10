import { Fragment, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminEmptyState, AdminPageHeader, AdminStatusPill } from "../AdminUi";
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

  const rows = useMemo(() => {
    const orders = data?.orders ?? [];
    return orders.map((o): OrderRow & { serviceLabel: string; packageLabel: string; userLabel: string; amountLabel: string } => {
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
    });
  }, [data?.orders]);

  return (
    <div>
      <AdminPageHeader eyebrow="Bookings" title="Orders" description="Review customer orders and expand rows for booking details." />

      {isLoading ? <div className="admin-panel mb-5 p-5 text-sm font-medium text-black/60">Loading...</div> : null}
      {error ? <div className="admin-panel mb-5 p-5 text-sm font-medium text-black/60">Unable to load orders.</div> : null}

      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="admin-table min-w-[1000px]">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Service</th>
                <th>Package</th>
                <th>Booking Info</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <Fragment key={o._id}>
                  <tr
                    className="cursor-pointer"
                    onClick={() => setOpenId((p) => (p === o._id ? null : o._id))}
                    title="Click to view booking details"
                  >
                    <td>{o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</td>
                    <td className="font-medium">{o.userLabel}</td>
                    <td>{o.serviceLabel}</td>
                    <td>{o.packageLabel}</td>
                    <td>
                      <div className="font-medium text-black">{o.customerName || "-"}</div>
                      <div className="text-xs text-black/55">
                        {o.customerPhone || "-"}
                        {o.customerEmail ? ` / ${o.customerEmail}` : ""}
                      </div>
                      <div className="text-xs text-black/55">
                        {(o.platformDetails as { accountUsername?: string } | undefined)?.accountUsername
                          ? `@${(o.platformDetails as { accountUsername?: string }).accountUsername}`
                          : ""}
                      </div>
                    </td>
                    <td className="font-semibold">{o.amountLabel}</td>
                    <td>
                      <AdminStatusPill tone={o.status === "paid" || o.status === "completed" ? "blue" : "neutral"}>
                        {o.status}
                      </AdminStatusPill>
                    </td>
                  </tr>
                  {openId === o._id ? (
                    <tr className="bg-[#4169E1]/5 hover:bg-[#4169E1]/5">
                      <td colSpan={7}>
                        <div className="grid gap-4 rounded-lg border border-[#c5c5c5] bg-white p-4 md:grid-cols-2">
                          <Detail label="Order ID" value={o._id} mono />
                          <Detail
                            label="User"
                            value={`${o.userId?.name ? `${o.userId.name} / ` : ""}${o.userId?.email || "-"}${
                              o.userId?.phone ? ` / ${o.userId.phone}` : ""
                            }`}
                          />
                          <Detail
                            label="Customer"
                            value={`${o.customerName || "-"}${o.customerEmail ? ` / ${o.customerEmail}` : ""}${
                              o.customerPhone ? ` / ${o.customerPhone}` : ""
                            }`}
                          />
                          <Detail label="Service / Package" value={`${o.serviceLabel} / ${o.packageLabel}`} />
                          <Detail
                            label="Amount"
                            value={o.amount != null && o.currency ? formatMoney(Number(o.amount || 0), o.currency) : "-"}
                          />
                          <Detail label="Status" value={o.status} />
                          <Detail label="Account Link" value={(o.platformDetails as { accountLink?: string } | undefined)?.accountLink || "-"} />
                          <Detail
                            label="Account Username"
                            value={(o.platformDetails as { accountUsername?: string } | undefined)?.accountUsername || "-"}
                          />
                          <div className="md:col-span-2">
                            <Detail label="Notes" value={(o.platformDetails as { notes?: string } | undefined)?.notes || "-"} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!rows.length && !isLoading ? (
        <div className="mt-4">
          <AdminEmptyState>No orders.</AdminEmptyState>
        </div>
      ) : null}
    </div>
  );
}

function Detail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-black/45">{label}</div>
      <div className={`mt-1 break-all text-sm text-black ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { AdminEmptyState, AdminPageHeader, AdminStatusPill } from "../AdminUi";
import { adminApiFetch } from "../adminApi";

type PaymentRow = {
  _id: string;
  createdAt?: string;
  amount?: number;
  amountInr?: number;
  currency?: string;
  status: string;
  userId?: { email?: string };
  orderId?: { status?: string };
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
};

export default function AdminPayments() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: () => adminApiFetch<{ payments: PaymentRow[] }>("/payments"),
    staleTime: 2_000,
  });

  const payments = data?.payments ?? [];

  return (
    <div>
      <AdminPageHeader eyebrow="Revenue" title="Payments" description="Track payment records and Razorpay references." />

      {isLoading ? <div className="admin-panel mb-5 p-5 text-sm font-medium text-black/60">Loading...</div> : null}
      {error ? <div className="admin-panel mb-5 p-5 text-sm font-medium text-black/60">Unable to load payments.</div> : null}

      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="admin-table min-w-[760px]">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Razorpay</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}</td>
                  <td className="font-medium">{p.userId?.email || "-"}</td>
                  <td className="font-semibold">
                    {p.currency || "INR"} {Number((p.amount != null ? p.amount : p.amountInr) || 0).toLocaleString("en-IN")}
                  </td>
                  <td>
                    <AdminStatusPill tone={p.status === "paid" || p.status === "captured" ? "blue" : "neutral"}>
                      {p.status}
                    </AdminStatusPill>
                  </td>
                  <td className="whitespace-nowrap text-xs text-black/55">
                    {p.razorpayOrderId || "-"}
                    {p.razorpayPaymentId ? ` / ${p.razorpayPaymentId}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!payments.length && !isLoading ? (
        <div className="mt-4">
          <AdminEmptyState>No payments.</AdminEmptyState>
        </div>
      ) : null}
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { adminApiFetch } from "../adminApi";

type PaymentRow = {
  _id: string;
  createdAt?: string;
  amountInr: number;
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
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Payments</h1>
      <p className="text-muted-foreground mb-6">Payment records.</p>

      {isLoading ? <div className="text-muted-foreground">Loading…</div> : null}
      {error ? <div className="text-muted-foreground">Unable to load payments.</div> : null}

      <div className="card-premium p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="p-3">Date</th>
              <th className="p-3">User</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Razorpay</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-t border-border">
                <td className="p-3">{p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}</td>
                <td className="p-3">{p.userId?.email || "-"}</td>
                <td className="p-3">
                  {p.currency || "INR"} {Number(p.amountInr || 0).toLocaleString("en-IN")}
                </td>
                <td className="p-3">{p.status}</td>
                <td className="p-3 text-xs text-muted-foreground">
                  {p.razorpayOrderId || "-"}
                  {p.razorpayPaymentId ? ` / ${p.razorpayPaymentId}` : ""}
                </td>
              </tr>
            ))}
            {!payments.length && !isLoading ? (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={5}>
                  No payments.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}


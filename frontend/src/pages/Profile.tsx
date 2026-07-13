import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, CreditCard, Save, UserRound } from "lucide-react";
import { apiFetch } from "@/lib/apiClient";
import { Currency, formatMoney } from "@/lib/currency";
import { getUserToken } from "@/lib/userAuth";
import { useToast } from "@/hooks/use-toast";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  city?: string;
  country?: string;
  bio?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
};

type ProfileResponse = { ok: true; profile: ProfileData };

type AccountOrder = {
  _id: string;
  serviceName?: string;
  packageName?: string;
  amount?: number;
  currency?: Currency;
  status: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  platformDetails?: { accountLink?: string; accountUsername?: string; notes?: string };
  createdAt: string;
};

type OrdersResponse = { ok: true; orders: AccountOrder[] };

type ProfileForm = {
  name: string;
  phone: string;
  company: string;
  website: string;
  city: string;
  country: string;
  bio: string;
};

const emptyForm: ProfileForm = {
  name: "",
  phone: "",
  company: "",
  website: "",
  city: "",
  country: "",
  bio: "",
};

function tokenOrThrow() {
  const token = getUserToken();
  if (!token) throw new Error("Please login again.");
  return token;
}

function toForm(profile: ProfileData): ProfileForm {
  return {
    name: profile.name || "",
    phone: profile.phone || "",
    company: profile.company || "",
    website: profile.website || "",
    city: profile.city || "",
    country: profile.country || "",
    bio: profile.bio || "",
  };
}

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ProfileForm>(emptyForm);

  const profileQuery = useQuery({
    queryKey: ["account-profile"],
    queryFn: () => apiFetch<ProfileResponse>("/account/profile", { token: tokenOrThrow() }),
  });

  const ordersQuery = useQuery({
    queryKey: ["account-orders"],
    queryFn: () => apiFetch<OrdersResponse>("/account/orders", { token: tokenOrThrow() }),
  });

  useEffect(() => {
    if (profileQuery.data?.profile) setForm(toForm(profileQuery.data.profile));
  }, [profileQuery.data?.profile]);

  const saveProfile = useMutation({
    mutationFn: (payload: ProfileForm) =>
      apiFetch<ProfileResponse>("/account/profile", {
        method: "PATCH",
        token: tokenOrThrow(),
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["account-profile"], data);
      setForm(toForm(data.profile));
      toast({ title: "Profile saved", description: "Your details have been updated." });
    },
    onError: (err: unknown) => {
      toast({
        title: "Unable to save profile",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    },
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    saveProfile.mutate(form);
  };

  const profile = profileQuery.data?.profile;
  const orders = ordersQuery.data?.orders ?? [];

  return (
    <div className="overflow-hidden">
      <section className="section-padding pt-28 bg-card">
        <div className="container-max">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-accent">Account</div>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">My Profile</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Manage your details and review your saved order history.
              </p>
            </div>
            {profile ? (
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                {profile.isEmailVerified ? "Verified account" : "Email not verified"}
              </div>
            ) : null}
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.25fr]">
            <form onSubmit={onSubmit} className="card-premium p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">Profile Details</h2>
                  <p className="text-sm text-muted-foreground">{profile?.email || "Loading account..."}</p>
                </div>
              </div>

              {profileQuery.isLoading ? <div className="text-sm text-muted-foreground">Loading profile...</div> : null}
              {profileQuery.error ? <div className="text-sm text-muted-foreground">Unable to load profile.</div> : null}

              <div className="grid gap-4">
                <Field label="Full Name" required value={form.name} onChange={(value) => setForm((p) => ({ ...p, name: value }))} />
                <Field label="Phone" value={form.phone} onChange={(value) => setForm((p) => ({ ...p, phone: value }))} />
                <Field label="Company" value={form.company} onChange={(value) => setForm((p) => ({ ...p, company: value }))} />
                <Field label="Website" value={form.website} onChange={(value) => setForm((p) => ({ ...p, website: value }))} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="City" value={form.city} onChange={(value) => setForm((p) => ({ ...p, city: value }))} />
                  <Field label="Country" value={form.country} onChange={(value) => setForm((p) => ({ ...p, country: value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Bio / Notes</label>
                  <textarea
                    value={form.bio}
                    onChange={(event) => setForm((p) => ({ ...p, bio: event.target.value }))}
                    className="mt-2 min-h-[120px] w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Tell us anything useful for future projects."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saveProfile.isPending || profileQuery.isLoading}
                className="btn-accent mt-6 w-full gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saveProfile.isPending ? "Saving..." : "Save Profile"}
              </button>
            </form>

            <div className="card-premium overflow-hidden p-0">
              <div className="border-b border-border p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">Order History</h2>
                    <p className="text-sm text-muted-foreground">Orders linked to your login account.</p>
                  </div>
                </div>
              </div>

              {ordersQuery.isLoading ? <div className="p-6 text-sm text-muted-foreground">Loading orders...</div> : null}
              {ordersQuery.error ? <div className="p-6 text-sm text-muted-foreground">Unable to load orders.</div> : null}

              {!ordersQuery.isLoading && !orders.length ? (
                <div className="p-6 text-sm text-muted-foreground">
                  No orders yet. <Link className="text-accent underline" to="/social-media-marketing">Browse services</Link>
                </div>
              ) : null}

              {orders.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[780px] text-sm">
                    <thead className="bg-primary text-primary-foreground">
                      <tr className="text-left">
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Service</th>
                        <th className="px-4 py-3 font-semibold">Package</th>
                        <th className="px-4 py-3 font-semibold">Amount</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Booking Info</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-t border-border">
                          <td className="px-4 py-4 align-top">{new Date(order.createdAt).toLocaleString()}</td>
                          <td className="px-4 py-4 align-top">{order.serviceName || "-"}</td>
                          <td className="px-4 py-4 align-top">{order.packageName || "-"}</td>
                          <td className="px-4 py-4 align-top font-semibold">
                            {order.amount != null && order.currency ? formatMoney(order.amount, order.currency) : "-"}
                          </td>
                          <td className="px-4 py-4 align-top">
                            <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold capitalize">
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 align-top text-muted-foreground">
                            <div className="font-medium text-foreground">{order.customerName || "-"}</div>
                            <div>{order.customerPhone || "-"}</div>
                            <div>{order.customerEmail || "-"}</div>
                            {order.platformDetails?.accountUsername ? <div>@{order.platformDetails.accountUsername}</div> : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  required,
  onChange,
}: {
  label: string;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-accent"
      />
    </div>
  );
}

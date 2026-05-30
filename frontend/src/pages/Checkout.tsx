import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronDown, CreditCard, Search } from "lucide-react";
import { apiFetch } from "@/lib/apiClient";
import { Currency, detectCurrency, formatMoney, getStoredCurrency, inrToUsd, setStoredCurrency } from "@/lib/currency";
import { countryCodes as allCountryCodes, getFlagUrl } from "@/lib/countries";
import { loadRazorpayCheckout } from "@/lib/razorpay";
import { useToast } from "@/hooks/use-toast";
import { getUserToken } from "@/lib/userAuth";

type Package = {
  _id: string;
  name: string;
  priceInr: number;
  priceUsd?: number;
  interval?: string;
  description?: string;
  features?: string[];
};

type Service = { _id: string; slug: string; name: string };

type PackageLookup = { service: Service; package: Package };

type CreatePaymentResponse = {
  ok: true;
  keyId: string;
  razorpayOrderId: string;
  amountMinor: number;
  currency: Currency;
  orderId: string;
  orderToken: string;
};

type VerifyPaymentResponse = { ok: true };

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

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

function addSavedOrder(entry: { id: string; token: string }) {
  const existing = getSavedOrders();
  const next = [{ id: entry.id, token: entry.token }, ...existing.filter((o) => o.id !== entry.id)].slice(0, 25);
  localStorage.setItem("liklet:orders", JSON.stringify(next));
}

export default function Checkout() {
  const { toast } = useToast();
  const { packageId } = useParams();
  const navigate = useNavigate();

  const [currency, setCurrency] = useState<Currency>("INR");
  const [isPaying, setIsPaying] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["public-package", packageId],
    enabled: Boolean(packageId),
    queryFn: () => apiFetch<PackageLookup>(`/public/packages/${packageId}`),
  });

  useEffect(() => {
    const cached = getStoredCurrency();
    if (cached) setCurrency(cached);
    detectCurrency().then(setCurrency).catch(() => setCurrency("INR"));
  }, []);

  const displayAmount = useMemo(() => {
    const pkg = data?.package;
    if (!pkg) return 0;
    if (currency === "USD") return Number(pkg.priceUsd ?? inrToUsd(pkg.priceInr));
    return Number(pkg.priceInr);
  }, [currency, data?.package]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryId: "IN",
    mobile: "",
    accountLink: "",
    accountUsername: "",
    notes: "",
  });

  const selectedCountry = useMemo(
    () => allCountryCodes.find((item) => item.id === formData.countryId) || allCountryCodes[0],
    [formData.countryId]
  );

  const filteredCountries = useMemo(() => {
    const query = countrySearch.trim().toLowerCase();
    if (!query) return allCountryCodes;
    return allCountryCodes.filter((item) => {
      const code = item.code.replace(/\D/g, "");
      const queryCode = query.replace(/\D/g, "");
      return (
        item.country.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.code.includes(query) ||
        (queryCode ? code.includes(queryCode) : false)
      );
    });
  }, [countrySearch]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!packageId) return;

    const token = getUserToken();
    if (!token) {
      navigate(`/auth?redirect=${encodeURIComponent(`/checkout/${packageId}`)}`, { replace: true });
      return;
    }

    setIsPaying(true);
    try {
      await loadRazorpayCheckout();
      if (!window.Razorpay) throw new Error("Razorpay Checkout not available");

      const customerPhone = `${selectedCountry.code} ${formData.mobile}`.trim();

      const create = await apiFetch<CreatePaymentResponse>("/payments/create", {
        method: "POST",
        token,
        body: JSON.stringify({
          packageId,
          currency,
          customer: { name: formData.fullName, email: formData.email, phone: customerPhone },
          platformDetails: {
            accountLink: formData.accountLink,
            accountUsername: formData.accountUsername,
            notes: formData.notes,
          },
        }),
      });

      const opts: Record<string, unknown> = {
        key: create.keyId,
        amount: create.amountMinor,
        currency: create.currency,
        name: "Liklet",
        description: `${data?.service?.name || "Service"} - ${data?.package?.name || "Package"}`,
        order_id: create.razorpayOrderId,
        prefill: { name: formData.fullName, email: formData.email, contact: customerPhone },
        notes: { orderId: create.orderId },
        handler: async (resp: unknown) => {
          const r = resp as {
            razorpay_payment_id?: string;
            razorpay_order_id?: string;
            razorpay_signature?: string;
          };
          try {
            await apiFetch<VerifyPaymentResponse>("/payments/verify", {
              method: "POST",
              token,
              body: JSON.stringify({
                orderId: create.orderId,
                razorpayOrderId: r.razorpay_order_id,
                razorpayPaymentId: r.razorpay_payment_id,
                razorpaySignature: r.razorpay_signature,
              }),
            });

            addSavedOrder({ id: create.orderId, token: create.orderToken });
            navigate("/my-orders", { replace: true });
          } catch (err: unknown) {
            toast({
              title: "Payment captured, verification failed",
              description: err instanceof Error ? err.message : "Please contact support with your payment reference.",
            });
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
          },
        },
        theme: { color: "#ef4444" },
      };

      const rp = new window.Razorpay(opts);
      rp.open();
    } catch (err: unknown) {
      toast({ title: "Unable to start payment", description: err instanceof Error ? err.message : "Try again." });
      setIsPaying(false);
    }
  };

  return (
    <div className="overflow-hidden">
      <section className="section-padding pt-28 bg-card">
        <div className="container-max max-w-3xl">
          <Link to={data?.service?.slug ? `/services/${data.service.slug}` : "/social-media-marketing"} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          {isLoading ? (
            <div className="text-muted-foreground">Loading package </div>
          ) : error ? (
            <div className="text-muted-foreground">Unable to load package.</div>
          ) : data ? (
            <div className="card-premium p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Book {data.package.name}
                  </h1>
                  <p className="text-muted-foreground">
                    {data.service.name}  {formatMoney(displayAmount, currency)}/{data.package.interval || "mo"}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-black">
                  <label className="flex items-center gap-2">
                    <span>Currency:</span>
                    <select
                      value={currency}
                      onChange={(e) => {
                        const next = e.target.value === "USD" ? "USD" : "INR";
                        setCurrency(next);
                        setStoredCurrency(next);
                      }}
                      className="bg-white text-black font-semibold outline-none"
                    >
                      <option className="bg-white text-black" value="USD">USD ($)</option>
                      <option className="bg-white text-black" value="INR">INR (₹)</option>
                    </select>
                  </label>
                </div>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <input
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Mobile</label>
                    <div
                      className="relative mt-2 flex rounded-lg border border-border bg-background focus-within:ring-2 focus-within:ring-accent"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                          setIsCountryOpen(false);
                        }
                      }}
                    >
                      <button
                        type="button"
                        aria-expanded={isCountryOpen}
                        aria-label="Select country code"
                        onClick={() => setIsCountryOpen((open) => !open)}
                        className="flex w-[150px] items-center gap-2 border-r border-border bg-white px-3 py-3 text-left text-sm font-semibold text-black outline-none"
                      >
                        <img
                          src={getFlagUrl(selectedCountry.id)}
                          alt=""
                          className="h-4 w-6 rounded-sm object-cover shadow-sm"
                        />
                        <span>{selectedCountry.code}</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-black/60" />
                      </button>
                      {isCountryOpen ? (
                        <div className="absolute left-0 top-full z-50 mt-2 w-[340px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-lg border border-border bg-white text-black shadow-xl">
                          <div className="relative border-b border-border">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45" />
                            <input
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              className="w-full bg-white py-3 pl-9 pr-3 text-sm text-black outline-none"
                              placeholder="Search country or code"
                            />
                          </div>
                          <div className="max-h-72 overflow-y-auto py-1">
                            {filteredCountries.map((item) => (
                              <button
                                type="button"
                                key={item.id}
                                onClick={() => {
                                  setFormData((p) => ({ ...p, countryId: item.id }));
                                  setIsCountryOpen(false);
                                  setCountrySearch("");
                                }}
                                className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-black hover:bg-accent/10"
                              >
                                <img
                                  src={getFlagUrl(item.id)}
                                  alt=""
                                  className="h-4 w-6 rounded-sm object-cover shadow-sm"
                                />
                                <span className="min-w-0 flex-1 truncate">{item.country}</span>
                                <span className="font-semibold">{item.code}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      <input
                        required
                        type="tel"
                        inputMode="tel"
                        value={formData.mobile}
                        onChange={(e) => setFormData((p) => ({ ...p, mobile: e.target.value }))}
                        className="min-w-0 flex-1 bg-background px-4 py-3 text-foreground outline-none"
                        placeholder="XXXXX XXXXX"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-accent"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Account Link (optional)</label>
                    <input
                      value={formData.accountLink}
                      onChange={(e) => setFormData((p) => ({ ...p, accountLink: e.target.value }))}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-accent"
                      placeholder="https://youtube.com/@..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Account Username (optional)</label>
                    <input
                      value={formData.accountUsername}
                      onChange={(e) => setFormData((p) => ({ ...p, accountUsername: e.target.value }))}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-accent"
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Notes (optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                    className="mt-2 w-full min-h-[110px] rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Anything we should know?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPaying}
                  className="btn-accent w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPaying ? "Opening Razorpay..." : `Pay ${formatMoney(displayAmount, currency)}`}
                  <CreditCard className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

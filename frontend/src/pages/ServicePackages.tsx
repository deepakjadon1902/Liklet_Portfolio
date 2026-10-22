import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/apiClient";
import {
  Currency,
  detectCurrency,
  formatMoney,
  getStoredCurrency,
  inrToUsd,
  setStoredCurrency,
} from "@/lib/currency";
import { getUserToken } from "@/lib/userAuth";
import PlatformMark from "@/components/brand/PlatformMark";
import FlipFadeText from "@/components/ui/flip-fade-text";

type Service = {
  _id: string;
  slug: string;
  name: string;
  tagline?: string;
  logoUrl?: string;
  features?: string[];
};
type Package = {
  _id: string;
  serviceId: string;
  name: string;
  priceInr: number;
  priceUsd?: number;
  interval?: string;
  description?: string;
  features?: string[];
  isPopular?: boolean;
};

export default function ServicePackages() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<Currency>("INR");
  useEffect(() => {
    const cached = getStoredCurrency();
    if (cached) setCurrency(cached);
    detectCurrency()
      .then(setCurrency)
      .catch(() => setCurrency("INR"));
  }, []);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["public-service", slug],
    enabled: Boolean(slug),
    queryFn: () => apiFetch<{ service: Service; packages: Package[] }>("/public/services/" + slug),
  });
  const sortedPackages = useMemo(() => {
    const order = ["basic", "premium", "elite"];
    return [...(data?.packages || [])].sort((a, b) => {
      const ai = order.indexOf(a.name.toLowerCase());
      const bi = order.indexOf(b.name.toLowerCase());
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      return a.priceInr - b.priceInr;
    });
  }, [data?.packages]);
  const price = (pkg: Package) =>
    currency === "USD"
      ? formatMoney(Number(pkg.priceUsd ?? inrToUsd(pkg.priceInr)), "USD")
      : formatMoney(Number(pkg.priceInr), "INR", "en-IN");
  return (
    <>
      <section className="section-padding border-b border-border bg-card">
        <div className="container-max">
          <Link
            to="/social-media-marketing#platforms"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            All social media services
          </Link>
          <div className="mt-7 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <PlatformMark slug={slug || ""} />
                <p className="eyebrow">Service packages</p>
              </div>
              <h1 className="page-title mt-4">
                {data?.service.name ? (
                  <>
                    {data.service.name}{" "}
                    <FlipFadeText words={["Packages", "Plans", "Growth Options"]} interval={2500} />
                  </>
                ) : (
                  "Find your service package"
                )}
              </h1>
              <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
                Compare the included work, choose a package, and continue to your booking.
              </p>
            </div>
            <label className="flex shrink-0 items-center gap-3 self-start rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium md:self-auto">
              Currency
              <select
                value={currency}
                onChange={(e) => {
                  const next = e.target.value === "USD" ? "USD" : "INR";
                  setCurrency(next);
                  setStoredCurrency(next);
                }}
                className="bg-transparent text-sm outline-none"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </label>
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-max">
          {isLoading && (
            <p role="status" className="text-muted-foreground">
              Loading packages...
            </p>
          )}
          {error && (
            <div role="alert" className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold">Packages couldn't be loaded.</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Please try again, or contact us to discuss the service you need.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-5">
                <button type="button" onClick={() => refetch()} className="btn-accent">
                  Try again
                </button>
                <Link to="/contact" className="text-sm font-semibold text-accent underline">
                  Contact our team
                </Link>
              </div>
            </div>
          )}
          {!isLoading && !error && data && !sortedPackages.length && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold">Let's put a plan together.</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                No packages are currently listed for this service.{" "}
                <Link to="/contact" className="font-medium text-accent underline">
                  Contact us about your requirements.
                </Link>
              </p>
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-3">
            {sortedPackages.map((pkg) => (
              <article
                key={pkg._id}
                className={
                  "flex flex-col rounded-xl border bg-card p-6 sm:p-7 " +
                  (pkg.isPopular ? "border-accent" : "border-border")
                }
              >
                <div className="flex min-h-7 items-center justify-between gap-3">
                  <h2 className="font-display text-xl font-semibold">{pkg.name}</h2>
                  {pkg.isPopular && (
                    <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                      Featured
                    </span>
                  )}
                </div>
                <p className="mt-6 text-3xl font-semibold tracking-tight">
                  {price(pkg)}
                  <span className="text-sm font-normal tracking-normal text-muted-foreground">
                    /{pkg.interval || "mo"}
                  </span>
                </p>
                {pkg.description && (
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{pkg.description}</p>
                )}
                <ul className="my-6 space-y-3 border-t border-border pt-6">
                  {(pkg.features || []).map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm leading-6">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={"/checkout/" + pkg._id}
                  className="btn-accent mt-auto w-full"
                  onClick={(e) => {
                    if (getUserToken()) return;
                    e.preventDefault();
                    navigate("/auth?redirect=" + encodeURIComponent("/checkout/" + pkg._id));
                  }}
                >
                  Choose {pkg.name}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

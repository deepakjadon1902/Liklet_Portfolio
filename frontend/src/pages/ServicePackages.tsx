import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/apiClient";

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
  interval?: string;
  description?: string;
  features?: string[];
  isPopular?: boolean;
};

const brandBySlug: Record<string, { color: string; gradientFrom: string; gradientTo: string }> = {
  youtube: { color: "#FF0000", gradientFrom: "#FF000033", gradientTo: "#111827" },
  facebook: { color: "#1877F2", gradientFrom: "#1877F233", gradientTo: "#111827" },
  instagram: { color: "#E1306C", gradientFrom: "#E1306C33", gradientTo: "#111827" },
  "twitter-x": { color: "#111111", gradientFrom: "#11111122", gradientTo: "#111827" },
  linkedin: { color: "#0A66C2", gradientFrom: "#0A66C233", gradientTo: "#111827" },
  tiktok: { color: "#00F2EA", gradientFrom: "#00F2EA33", gradientTo: "#111827" },
  telegram: { color: "#229ED9", gradientFrom: "#229ED933", gradientTo: "#111827" },
  "whatsapp-business": { color: "#25D366", gradientFrom: "#25D36633", gradientTo: "#111827" },
};

export default function ServicePackages() {
  const { slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["public-service", slug],
    enabled: Boolean(slug),
    queryFn: () => apiFetch<{ service: Service; packages: Package[] }>(`/public/services/${slug}`),
  });

  const sortedPackages = useMemo(() => {
    const pkgs = data?.packages ?? [];
    const order = ["basic", "premium", "elite"];
    return [...pkgs].sort((a, b) => {
      const ai = order.indexOf(a.name.toLowerCase());
      const bi = order.indexOf(b.name.toLowerCase());
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      return (a.priceInr ?? 0) - (b.priceInr ?? 0);
    });
  }, [data?.packages]);

  const subject = data?.service?.name || "Social Media";
  const brand = slug ? brandBySlug[slug] : undefined;
  const brandColor = brand?.color || "#0ea5e9";

  return (
    <div className="overflow-hidden">
      <section
        className="section-padding pt-28"
        style={{
          background: `linear-gradient(135deg, ${brand?.gradientFrom || "rgba(14,165,233,0.25)"}, ${
            brand?.gradientTo || "hsl(var(--primary))"
          })`,
        }}
      >
        <div className="container-max">
          <Link
            to="/social-media-marketing"
            className="inline-flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Social Media
          </Link>

          {isLoading ? (
            <div className="text-primary-foreground/90">Loading packages…</div>
          ) : error ? (
            <div className="text-primary-foreground/90">Unable to load packages.</div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-background/80 border border-border flex items-center justify-center p-3">
                {data?.service?.logoUrl ? (
                  <img
                    src={data.service.logoUrl}
                    alt={`${data.service.name} logo`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
                  {data?.service?.name} Packages
                </h1>
                <p className="text-primary-foreground/80 max-w-2xl">
                  {data?.service?.tagline || "Choose the package that fits your goals."}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {!isLoading && data ? (
        <section className="bg-card section-padding">
          <div className="container-max">
            <div className="grid md:grid-cols-3 gap-6">
              {sortedPackages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="card-premium p-6"
                  style={
                    pkg.isPopular
                      ? {
                          borderColor: brandColor,
                          boxShadow: `0 0 0 2px ${brandColor}33, var(--shadow-md)`,
                        }
                      : undefined
                  }
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-display text-xl font-bold text-foreground">{pkg.name}</h2>
                    {pkg.isPopular ? (
                      <span
                        className="text-xs px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: brandColor }}
                      >
                        Popular
                      </span>
                    ) : null}
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    ₹{Number(pkg.priceInr || 0).toLocaleString("en-IN")}
                    <span className="text-sm font-medium text-muted-foreground">/{pkg.interval || "mo"}</span>
                  </div>
                  {pkg.description ? (
                    <p className="text-muted-foreground mt-2">{pkg.description}</p>
                  ) : null}

                  <ul className="space-y-2 mt-5">
                    {(pkg.features || []).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground/90">
                        <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/social-media-marketing/contact?subject=${encodeURIComponent(subject)}`}
                    className="w-full inline-flex items-center justify-center mt-6 px-4 py-3 rounded-lg font-medium text-white transition-colors"
                    style={{ backgroundColor: brandColor }}
                  >
                    Contact for {pkg.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

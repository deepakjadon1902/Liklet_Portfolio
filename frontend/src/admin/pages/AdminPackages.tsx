import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Save } from "lucide-react";
import { AdminPageHeader, AdminStatusPill } from "../AdminUi";
import { adminApiFetch } from "../adminApi";

type Service = { _id: string; name: string; slug: string; type: string };
type Package = {
  _id: string;
  serviceId: string;
  name: string;
  priceInr: number;
  interval?: string;
  description?: string;
  features?: string[];
  isPopular?: boolean;
  isActive?: boolean;
};

const EMPTY_SERVICES: Service[] = [];

function normalizeFeatures(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminPackages() {
  const qc = useQueryClient();
  const { data: servicesData } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => adminApiFetch<{ services: Service[] }>("/services"),
    staleTime: 5_000,
  });

  const services = servicesData?.services ?? EMPTY_SERVICES;
  const [serviceId, setServiceId] = useState<string>("");

  useEffect(() => {
    if (!serviceId && services[0]?._id) setServiceId(services[0]._id);
  }, [serviceId, services]);

  const { data: packagesData, isLoading, error } = useQuery({
    queryKey: ["admin-packages", serviceId],
    enabled: Boolean(serviceId),
    queryFn: () => adminApiFetch<{ packages: Package[] }>(`/packages?serviceId=${encodeURIComponent(serviceId)}`),
    staleTime: 2_000,
  });

  const packages = useMemo(() => {
    const pkgs = packagesData?.packages ?? [];
    const order = ["basic", "premium", "elite"];
    return [...pkgs].sort((a, b) => {
      const ai = order.indexOf(a.name.toLowerCase());
      const bi = order.indexOf(b.name.toLowerCase());
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      return (a.priceInr ?? 0) - (b.priceInr ?? 0);
    });
  }, [packagesData?.packages]);

  const saveMutation = useMutation({
    mutationFn: async (payload: { id: string; patch: Partial<Package> & { features?: string[] } }) => {
      return adminApiFetch(`/packages/${payload.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload.patch),
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin-packages", serviceId] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!serviceId) throw new Error("Missing service");
      return adminApiFetch("/packages", {
        method: "POST",
        body: JSON.stringify({
          serviceId,
          name: "New Package",
          priceInr: 0,
          interval: "mo",
          description: "",
          features: [],
          isPopular: false,
          isActive: true,
        }),
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin-packages", serviceId] });
    },
  });

  return (
    <div>
      <AdminPageHeader
        eyebrow="Pricing"
        title="Packages"
        description="Manage Basic, Premium, and Elite plans for each service with clean pricing and feature controls."
        actions={
          <button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending || !serviceId}
            className="admin-btn-primary gap-2"
          >
            <Plus className="h-4 w-4" />
            {createMutation.isPending ? "Adding..." : "Add Package"}
          </button>
        }
      />

      <div className="admin-card mb-6 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="admin-kicker">Service scope</div>
          <label className="mt-1 block text-sm font-semibold text-black">Choose service</label>
        </div>
        <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="admin-input sm:max-w-md">
          {services.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.slug})
            </option>
          ))}
        </select>
      </div>

      {isLoading ? <div className="admin-panel mb-5 p-5 text-sm font-medium text-black/60">Loading...</div> : null}
      {error ? <div className="admin-panel mb-5 p-5 text-sm font-medium text-black/60">Unable to load packages.</div> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg._id}
            pkg={pkg}
            onSave={(patch) =>
              saveMutation.mutate({
                id: pkg._id,
                patch,
              })
            }
            isSaving={saveMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
}

function PackageCard({
  pkg,
  onSave,
  isSaving,
}: {
  pkg: Package;
  onSave: (patch: Partial<Package> & { features?: string[] }) => void;
  isSaving: boolean;
}) {
  const [name, setName] = useState(pkg.name);
  const [priceInr, setPriceInr] = useState(String(pkg.priceInr ?? 0));
  const [interval, setInterval] = useState(pkg.interval || "mo");
  const [description, setDescription] = useState(pkg.description || "");
  const [featuresText, setFeaturesText] = useState((pkg.features || []).join("\n"));
  const [isPopular, setIsPopular] = useState(Boolean(pkg.isPopular));
  const [isActive, setIsActive] = useState(pkg.isActive !== false);
  const featuresKey = (pkg.features || []).join("\n");

  useEffect(() => {
    setName(pkg.name);
    setPriceInr(String(pkg.priceInr ?? 0));
    setInterval(pkg.interval || "mo");
    setDescription(pkg.description || "");
    setFeaturesText(featuresKey);
    setIsPopular(Boolean(pkg.isPopular));
    setIsActive(pkg.isActive !== false);
  }, [pkg._id, pkg.name, pkg.priceInr, pkg.interval, pkg.description, featuresKey, pkg.isPopular, pkg.isActive]);

  return (
    <div className={`admin-card p-5 ${isPopular ? "ring-2 ring-[#4169E1]" : ""}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="admin-kicker">Plan</div>
          <input value={name} onChange={(e) => setName(e.target.value)} className="admin-input mt-2 font-semibold" />
        </div>
        <AdminStatusPill tone={isActive ? "blue" : "neutral"}>{isActive ? "Active" : "Hidden"}</AdminStatusPill>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-black/60">Price (INR)</label>
          <input value={priceInr} onChange={(e) => setPriceInr(e.target.value)} className="admin-input mt-1" />
        </div>
        <div>
          <label className="text-xs font-semibold text-black/60">Interval</label>
          <input value={interval} onChange={(e) => setInterval(e.target.value)} className="admin-input mt-1" placeholder="mo" />
        </div>
      </div>

      <div className="mt-3">
        <label className="text-xs font-semibold text-black/60">Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className="admin-input mt-1" />
      </div>

      <div className="mt-3">
        <label className="text-xs font-semibold text-black/60">Features (one per line)</label>
        <textarea
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          className="admin-input mt-1 min-h-[120px]"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-black">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Active
          </label>
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-black">
            <input type="checkbox" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} />
            Popular
          </label>
        </div>
        <button
          disabled={isSaving}
          onClick={() =>
            onSave({
              name,
              priceInr: Number(priceInr || 0),
              interval,
              description,
              features: normalizeFeatures(featuresText),
              isPopular,
              isActive,
            })
          }
          className="admin-btn-primary gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

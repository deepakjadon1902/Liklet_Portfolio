import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { AdminPageHeader, AdminStatusPill } from "../AdminUi";
import { adminApiFetch } from "../adminApi";

type Service = {
  _id: string;
  type: string;
  slug: string;
  name: string;
  tagline?: string;
  logoUrl?: string;
  features?: string[];
  isActive: boolean;
};

const EMPTY_SERVICES: Service[] = [];

export default function AdminServices() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => adminApiFetch<{ services: Service[] }>("/services"),
    staleTime: 5_000,
  });

  const services = data?.services ?? EMPTY_SERVICES;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => services.find((s) => s._id === selectedId) || services[0] || null,
    [services, selectedId]
  );

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    logoUrl: "",
    featuresText: "",
    isActive: true,
  });

  useEffect(() => {
    if (!selected) return;
    setSelectedId((prev) => prev || selected._id);
    setForm({
      name: selected.name || "",
      tagline: selected.tagline || "",
      logoUrl: selected.logoUrl || "",
      featuresText: (selected.features || []).join("\n"),
      isActive: Boolean(selected.isActive),
    });
  }, [selected]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selected) throw new Error("No service selected");
      const features = form.featuresText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      return adminApiFetch<{ ok: boolean; service: Service }>(`/services/${selected._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: form.name,
          tagline: form.tagline,
          logoUrl: form.logoUrl,
          features,
          isActive: form.isActive,
        }),
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin-services"] });
      await qc.invalidateQueries({ queryKey: ["public-services", "social-media"] });
    },
  });

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Services"
        description="Edit the platform services that appear across the public website."
      />

      {isLoading ? <div className="admin-panel mb-5 p-5 text-sm font-medium text-black/60">Loading...</div> : null}
      {error ? <div className="admin-panel mb-5 p-5 text-sm font-medium text-black/60">Unable to load services.</div> : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="admin-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="admin-kicker">Library</div>
              <div className="font-display text-xl font-bold text-black">All Services</div>
            </div>
            <span className="rounded-full bg-[#4169E1] px-2.5 py-1 text-xs font-semibold text-white">
              {services.length}
            </span>
          </div>
          <div className="space-y-2">
            {services.map((s) => {
              const active = (selected?._id || "") === s._id;
              return (
                <button
                  key={s._id}
                  onClick={() => setSelectedId(s._id)}
                  className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                    active
                      ? "border-[#4169E1] bg-[#4169E1] text-white"
                      : "border-[#c5c5c5] bg-white text-black hover:border-[#4169E1]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold">{s.name}</div>
                    <div className={active ? "text-xs text-white/75" : "text-xs text-black/50"}>{s.slug}</div>
                  </div>
                  <div className={active ? "mt-1 text-xs text-white/75" : "mt-1 text-xs text-black/55"}>
                    {s.type} / {s.isActive ? "Active" : "Hidden"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="admin-card p-6 lg:col-span-2">
          {!selected ? (
            <div className="text-black/55">No service selected.</div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="admin-kicker">Editing</div>
                  <div className="font-display text-2xl font-bold text-black">{selected.name}</div>
                  <div className="text-sm text-black/55">{selected.slug}</div>
                </div>
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-black">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  />
                  <AdminStatusPill tone={form.isActive ? "blue" : "neutral"}>
                    {form.isActive ? "Active" : "Hidden"}
                  </AdminStatusPill>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-black">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="admin-input mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-black">Logo URL</label>
                  <input
                    value={form.logoUrl}
                    onChange={(e) => setForm((p) => ({ ...p, logoUrl: e.target.value }))}
                    className="admin-input mt-2"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-black">Tagline</label>
                <input
                  value={form.tagline}
                  onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
                  className="admin-input mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-black">Features (one per line)</label>
                <textarea
                  value={form.featuresText}
                  onChange={(e) => setForm((p) => ({ ...p, featuresText: e.target.value }))}
                  className="admin-input mt-2 min-h-[160px]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  disabled={saveMutation.isPending}
                  onClick={() => saveMutation.mutate()}
                  className="admin-btn-primary gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saveMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
                {saveMutation.isError ? <div className="text-sm font-medium text-black/60">Save failed.</div> : null}
                {saveMutation.isSuccess ? <div className="text-sm font-medium text-black/60">Saved.</div> : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

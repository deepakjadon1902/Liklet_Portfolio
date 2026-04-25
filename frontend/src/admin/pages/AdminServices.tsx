import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

  // keep form in sync when selection changes
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?._id]);

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
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Services</h1>
      <p className="text-muted-foreground mb-6">Edit platform services shown on the website.</p>

      {isLoading ? <div className="text-muted-foreground">Loading…</div> : null}
      {error ? <div className="text-muted-foreground">Unable to load services.</div> : null}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card-premium p-4">
          <div className="text-sm font-medium text-foreground mb-3">All Services</div>
          <div className="space-y-2">
            {services.map((s) => (
              <button
                key={s._id}
                onClick={() => setSelectedId(s._id)}
                className={`w-full text-left px-3 py-2 rounded-lg border ${
                  (selected?._id || "") === s._id ? "border-accent bg-accent/10" : "border-border hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-foreground">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.slug}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {s.type} • {s.isActive ? "Active" : "Hidden"}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 card-premium p-6">
          {!selected ? (
            <div className="text-muted-foreground">No service selected.</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Editing</div>
                  <div className="font-display text-xl font-bold text-foreground">{selected.name}</div>
                  <div className="text-sm text-muted-foreground">{selected.slug}</div>
                </div>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  />
                  Active
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Logo URL</label>
                  <input
                    value={form.logoUrl}
                    onChange={(e) => setForm((p) => ({ ...p, logoUrl: e.target.value }))}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Tagline</label>
                <input
                  value={form.tagline}
                  onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Features (one per line)</label>
                <textarea
                  value={form.featuresText}
                  onChange={(e) => setForm((p) => ({ ...p, featuresText: e.target.value }))}
                  className="mt-2 w-full min-h-[160px] rounded-lg border border-border bg-background px-4 py-3"
                />
              </div>

              <button
                disabled={saveMutation.isPending}
                onClick={() => saveMutation.mutate()}
                className="btn-accent"
              >
                {saveMutation.isPending ? "Saving…" : "Save Changes"}
              </button>
              {saveMutation.isError ? (
                <div className="text-sm text-muted-foreground">Save failed.</div>
              ) : null}
              {saveMutation.isSuccess ? (
                <div className="text-sm text-muted-foreground">Saved.</div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

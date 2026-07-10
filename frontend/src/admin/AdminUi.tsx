import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <div className="admin-kicker mb-2">{eyebrow}</div> : null}
        <h1 className="font-display text-3xl font-bold text-black md:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/65">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export function AdminMetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: ReactNode;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="admin-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-black/60">{label}</div>
          <div className="mt-3 text-4xl font-bold text-black">{value}</div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#4169E1] text-white">
          {icon}
        </div>
      </div>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#c5c5c5]">
        <div className="h-full w-2/3 rounded-full bg-[#4169E1]" />
      </div>
      <div className="mt-3 text-xs font-medium text-black/55">{detail}</div>
    </div>
  );
}

export function AdminStatusPill({ children, tone = "neutral" }: { children: ReactNode; tone?: "blue" | "dark" | "neutral" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
        tone === "blue" && "border-[#4169E1] bg-[#4169E1] text-white",
        tone === "dark" && "border-black bg-black text-white",
        tone === "neutral" && "border-[#c5c5c5] bg-white text-black"
      )}
    >
      {children}
    </span>
  );
}

export function AdminEmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="admin-panel p-8 text-center text-sm font-medium text-black/55">
      {children}
    </div>
  );
}

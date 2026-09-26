"use client";

import { cn } from "@/lib/utils";

interface LampEffectProps {
  children?: React.ReactNode;
  className?: string;
}

export function LampEffect({ children, className }: LampEffectProps) {
  return (
    <section
      className={cn(
        "hero-gradient relative flex min-h-[500px] w-full items-center justify-center overflow-hidden px-5 py-16",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]" />
      <div className="relative z-10 flex max-w-5xl flex-col items-center text-center">{children}</div>
    </section>
  );
}

export function LampContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "hero-gradient relative flex min-h-[500px] w-full items-center justify-center overflow-hidden px-5 py-16 md:min-h-[540px]",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]" />
      <div className="relative z-10 flex max-w-5xl flex-col items-center text-center">{children}</div>
    </section>
  );
}

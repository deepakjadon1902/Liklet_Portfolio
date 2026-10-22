import { cn } from "@/lib/utils";

export default function Brand({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-display text-[1.75rem] font-extrabold tracking-[-0.06em] leading-none",
        className,
      )}
    >
      <img
        src="/images/logo.jpg"
        alt=""
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 rounded-md bg-white object-contain"
      />
      <span>Liklet</span>
    </span>
  );
}

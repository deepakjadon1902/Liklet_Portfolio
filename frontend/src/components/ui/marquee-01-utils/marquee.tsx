import * as React from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = React.HTMLAttributes<HTMLDivElement> & {
  reverse?: boolean;
  pauseOnHover?: boolean;
};

export function Marquee({ className, reverse, pauseOnHover = false, children, ...props }: MarqueeProps) {
  return (
    <div className={cn("group flex w-full overflow-hidden py-2", className)} {...props}>
      <div
        className={cn(
          "flex min-w-full shrink-0 items-stretch gap-4",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "flex min-w-full shrink-0 items-stretch gap-4",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
      >
        {children}
      </div>
    </div>
  );
}

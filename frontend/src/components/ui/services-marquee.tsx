import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ServiceMarqueeItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  image: string;
};

const serviceMeta: Record<string, string> = {
  "IT Services": "High-converting websites",
  "Social Media Marketing": "Content that gets noticed",
  "Digital Marketing": "Measurable growth campaigns",
  "Video Editing & Reviews": "Edits that hold attention",
};

export default function ServicesMarquee({ services }: { services: ServiceMarqueeItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || services.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % services.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [paused, services.length]);

  const move = (direction: -1 | 1) => {
    setActiveIndex((index) => (index + direction + services.length) % services.length);
  };

  return (
    <div
      className="relative mx-auto w-full max-w-7xl px-4 sm:px-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {services.map((service, index) => (
            <button
              key={service.title}
              type="button"
              aria-label={`Show ${service.title}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === activeIndex ? "w-9 bg-accent" : "w-2.5 bg-foreground/16 hover:bg-foreground/35",
              )}
            />
          ))}
        </div>
        <div className="hidden gap-2 sm:flex">
          <CarouselButton direction="left" onClick={() => move(-1)} />
          <CarouselButton direction="right" onClick={() => move(1)} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:h-[24rem] lg:grid-cols-4 xl:gap-4">
        {services.map((service, index) => (
          <ServiceAccordionCard
            key={service.title}
            service={service}
            index={index}
            isActive={index === activeIndex}
            onOpen={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

function ServiceAccordionCard({
  service,
  index,
  isActive,
  onOpen,
}: {
  service: ServiceMarqueeItem;
  index: number;
  isActive: boolean;
  onOpen: () => void;
}) {
  const Icon = service.icon;

  return (
    <motion.article
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0.9,
      }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-xl bg-[#0b1220] shadow-[0_18px_45px_rgba(15,23,42,0.12)] transition-[box-shadow,transform] duration-500 ease-out lg:h-[24rem]",
        isActive
          ? "min-h-[20rem] ring-1 ring-accent/30 lg:min-h-0"
          : "min-h-[7.25rem] cursor-pointer hover:shadow-[0_20px_55px_rgba(15,23,42,0.16)] lg:min-h-0",
      )}
      onClick={!isActive ? onOpen : undefined}
    >
      <img
        src={service.image}
        alt={service.title}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div
        className={cn(
          "absolute inset-0 transition duration-500",
          isActive
            ? "bg-[linear-gradient(90deg,rgba(6,10,18,0.94)_0%,rgba(6,10,18,0.76)_48%,rgba(6,10,18,0.22)_100%)]"
            : "bg-[linear-gradient(180deg,rgba(6,10,18,0.12)_0%,rgba(6,10,18,0.76)_100%)]",
        )}
      />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white sm:p-6 lg:p-7">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/72">
          <Icon className="h-4 w-4" />
          <span>{isActive ? serviceMeta[service.title] : String(index + 1).padStart(2, "0")}</span>
        </div>

        <h3 className={cn("font-display font-extrabold leading-tight text-white", isActive ? "text-2xl xl:text-3xl" : "text-xl")}>
          {service.title}
        </h3>

        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div
              key={`${service.title}-content`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.34, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4"
            >
              <p className="line-clamp-4 text-sm font-semibold leading-6 text-white/88 xl:text-base xl:leading-7">
                {service.description}
              </p>

              <Link
                to={service.link}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-extrabold text-black shadow-lg transition hover:-translate-y-0.5 hover:bg-white/92"
                onClick={(event) => event.stopPropagation()}
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

function CarouselButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const isLeft = direction === "left";
  const Icon = isLeft ? ArrowLeft : ArrowRight;

  return (
    <button
      type="button"
      aria-label={isLeft ? "Previous service" : "Next service"}
      onClick={onClick}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-foreground/12 bg-white text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-accent/30 hover:text-accent",
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

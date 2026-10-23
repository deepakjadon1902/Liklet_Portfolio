import ServiceMark from "@/components/brand/ServiceMark";

type ServiceCardVisualProps = {
  path: string;
  title: string;
};

const serviceVisuals = {
  "/it-services": {
    image: "/service-cards/it-services.jpg",
    alt: "Developer building a web application on a laptop",
    label: "Web, app and CRM development",
    position: "center",
  },
  "/social-media-marketing": {
    image: "/service-cards/social-media.jpg",
    alt: "A person viewing social video content on a smartphone",
    label: "Content made for social feeds",
    position: "center",
  },
  "/digital-marketing": {
    image: "/service-cards/digital-marketing.jpg",
    alt: "Marketing analytics and growth charts displayed on a laptop",
    label: "Measure, learn and improve",
    position: "center",
  },
  "/video-editing": {
    image: "/service-cards/video-editing.jpg",
    alt: "Video editor working with a professional editing timeline",
    label: "From raw footage to final cut",
    position: "center",
  },
};

export default function ServiceCardVisual({ path, title }: ServiceCardVisualProps) {
  const visual = serviceVisuals[path as keyof typeof serviceVisuals];
  if (!visual) return null;

  return (
    <div className="relative h-full overflow-hidden bg-slate-900">
      <img
        src={visual.image}
        alt={visual.alt}
        width={1200}
        height={675}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        style={{ objectPosition: visual.position }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/5 to-transparent" />
      <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-slate-900 shadow-sm backdrop-blur-sm">
        <ServiceMark path={path} className="h-4 w-4" />
        <span>{title}</span>
      </div>
      <p className="absolute inset-x-3 bottom-3 text-xs font-semibold text-white drop-shadow-sm">
        {visual.label}
      </p>
    </div>
  );
}

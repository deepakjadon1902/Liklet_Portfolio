import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee-01-utils/marquee";
import { cn } from "@/lib/utils";

export type TestimonialReview = {
  name: string;
  username: string;
  body: string;
  rating?: number;
  service?: string;
};

const reviews: TestimonialReview[] = [
  {
    name: "Aarav Mehta",
    username: "Google verified customer",
    service: "Website redesign",
    rating: 4.5,
    body: "Liklet rebuilt our website with a much cleaner structure. We started getting better quality inquiries within the first few weeks.",
  },
  {
    name: "Priya Nair",
    username: "Google verified customer",
    service: "Social media marketing",
    rating: 4,
    body: "Their team made our Instagram content look consistent and professional. The monthly reporting was simple, honest, and easy to understand.",
  },
  {
    name: "Rohan Sharma",
    username: "Google verified customer",
    service: "Google Ads",
    rating: 4,
    body: "We were wasting ad budget before. Liklet cleaned up the campaign and helped us track calls, messages, and real leads properly.",
  },
  {
    name: "Sneha Kapoor",
    username: "Google verified customer",
    service: "Brand content",
    rating: 5,
    body: "The best part was how clearly they explained everything. No jargon, no pressure, just practical steps and polished execution.",
  },
  {
    name: "Vikram Singh",
    username: "Google verified customer",
    service: "E-commerce website",
    rating: 4.5,
    body: "Our product pages feel premium now, and the checkout journey is much smoother. The design finally matches the quality of our brand.",
  },
  {
    name: "Ananya Gupta",
    username: "Google verified customer",
    service: "SEO",
    rating: 4,
    body: "Liklet helped us organize our pages and content around what customers actually search for. Traffic and inquiries became more consistent.",
  },
  {
    name: "Kabir Malhotra",
    username: "Google verified customer",
    service: "Video editing",
    rating: 4.5,
    body: "They cleaned up our videos without making them feel over-edited. The pacing, captions, and thumbnails all improved noticeably.",
  },
  {
    name: "Meera Joshi",
    username: "Google verified customer",
    service: "Full digital setup",
    rating: 5,
    body: "From website updates to campaign planning, everything felt organized. It was easy to see what was done and what result it created.",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase();

const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star key={`full-${index}`} className="h-3.5 w-3.5 fill-[#FBBC05] text-[#FBBC05]" />
      ))}
      {hasHalfStar ? (
        <span className="relative h-3.5 w-3.5 text-[#FBBC05]">
          <Star className="h-3.5 w-3.5 text-[#FBBC05]" />
          <span className="absolute inset-0 w-1/2 overflow-hidden">
            <Star className="h-3.5 w-3.5 fill-[#FBBC05] text-[#FBBC05]" />
          </span>
        </span>
      ) : null}
    </div>
  );
};

const ReviewCard = ({ name, username, body, rating = 5, service }: TestimonialReview) => {
  return (
    <Card className="relative h-full w-72 cursor-default overflow-hidden border-white/10 bg-white shadow-sm p-4">
      <CardContent className="flex flex-col gap-3 p-0">
        <div className="flex flex-row items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4285F4] text-sm font-extrabold text-white">
            {getInitial(name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-950">{name}</p>
            <p className="truncate text-xs font-semibold text-slate-500">{username}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <RatingStars rating={rating} />
          <span className="ml-1 shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-extrabold leading-none text-slate-800">
            {rating.toFixed(1)}/5
          </span>
          {service ? <span className="ml-2 truncate text-xs font-semibold text-slate-500">{service}</span> : null}
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-slate-700">{body}</p>
      </CardContent>
    </Card>
  );
};

export default function TestimonialMarquee({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex w-full flex-col items-center justify-center overflow-hidden", className)}>
      <Marquee pauseOnHover className="[--duration:26s]">
        {firstRow.map((review) => (
          <ReviewCard key={`${review.name}-${review.service}`} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:26s]">
        {secondRow.map((review) => (
          <ReviewCard key={`${review.name}-${review.service}`} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent md:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent md:w-32" />
    </div>
  );
}

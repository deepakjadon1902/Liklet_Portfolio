import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import ServicePage, { Offering } from "@/components/marketing/ServicePage";
import PlatformMark from "@/components/brand/PlatformMark";
import { apiFetch } from "@/lib/apiClient";
import FlipFadeText from "@/components/ui/flip-fade-text";

const offerings: Offering[] = [
  {
    title: "Content planning",
    description:
      "A posting plan based on your services, your audience, and the things you want to communicate.",
    features: ["Monthly content topics", "Posting calendar", "Campaign planning"],
  },
  {
    title: "Posts & creative",
    description:
      "Images, carousels, and captions that explain your business and keep your accounts consistent.",
    features: ["Post design", "Captions and copy", "Brand consistency"],
  },
  {
    title: "Reels & short videos",
    description:
      "Turn product footage, useful tips, and business updates into short videos suited to each platform.",
    features: ["Video editing", "On-screen captions", "Platform-ready formats"],
  },
  {
    title: "Account management",
    description:
      "Help with publishing, profile information, and the everyday work of maintaining your presence.",
    features: ["Profile updates", "Post scheduling", "Content coordination"],
  },
  {
    title: "Community management",
    description: "Give your audience a clear way to ask questions and receive useful replies.",
    features: ["Comment and message guidance", "Response templates", "Enquiry handover"],
  },
  {
    title: "Performance reviews",
    description:
      "Review the content people respond to and use that information to plan what comes next.",
    features: ["Reach and engagement reports", "Content reviews", "Next-month recommendations"],
  },
];

const fallbackPlatforms = [
  { slug: "youtube", name: "YouTube", subject: "YouTube" },
  { slug: "facebook", name: "Facebook", subject: "Facebook" },
  { slug: "instagram", name: "Instagram", subject: "Instagram" },
  { slug: "twitter-x", name: "X", subject: "Twitter/X" },
  { slug: "linkedin", name: "LinkedIn", subject: "LinkedIn" },
  { slug: "tiktok", name: "TikTok", subject: "TikTok" },
  { slug: "telegram", name: "Telegram", subject: "Telegram" },
  { slug: "whatsapp-business", name: "WhatsApp Business", subject: "WhatsApp Business" },
];
type PublicService = { _id: string; slug: string; name: string };

export default function SocialMediaMarketing() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-services", "social-media"],
    queryFn: () => apiFetch<{ services: PublicService[] }>("/public/services?type=social-media"),
    staleTime: 60_000,
  });
  const hasLivePlatforms = Boolean(data?.services?.length);
  const platforms = hasLivePlatforms
    ? data!.services.map((s) => ({
        ...s,
        subject: fallbackPlatforms.find((p) => p.slug === s.slug)?.subject || s.name,
      }))
    : fallbackPlatforms;
  return (
    <ServicePage
      label="02 / Social media"
      title={
        <>
          Social Media That
          <span className="block">
            <FlipFadeText
              words={["Actually Sells", "Builds Trust", "Grows Daily"]}
              interval={2600}
            />
          </span>
        </>
      }
      intro={
        <>
          Social Media <FlipFadeText words={["Services", "Growth", "Systems"]} interval={2400} />
        </>
      }
      description="Content planning, post design, short videos, and account management. We help you explain what you offer and keep the conversation going with your audience."
      contactHref="/social-media-marketing/contact"
      offerings={offerings}
    >
      <section className="section-padding border-t border-border bg-card" id="platforms">
        <div className="container-max">
          <p className="eyebrow">Platforms</p>
          <h2 className="section-title mt-3">Meet your audience where they are.</h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            Choose a platform to explore available packages or talk to us about the support you
            need.
          </p>
          {isLoading && (
            <p role="status" className="mt-5 text-sm text-muted-foreground">
              Checking available packages...
            </p>
          )}
          {isError && (
            <p role="status" className="mt-5 text-sm text-muted-foreground">
              Packages are temporarily unavailable. You can still enquire about any platform below.
            </p>
          )}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {platforms.map((platform) => (
              <Link
                key={platform.slug}
                to={
                  hasLivePlatforms
                    ? "/services/" + platform.slug
                    : "/social-media-marketing/contact?subject=" +
                      encodeURIComponent(platform.subject)
                }
                className="group flex min-h-24 items-center gap-4 rounded-lg border border-border p-5 transition-colors hover:border-accent/50"
              >
                <PlatformMark slug={platform.slug} />
                <div className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{platform.name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {hasLivePlatforms ? "View packages" : "Ask about services"}
                  </span>
                </div>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <TestimonialsSection variant="social" />
    </ServicePage>
  );
}

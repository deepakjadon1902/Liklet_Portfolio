import ServicePage, { Offering } from "@/components/marketing/ServicePage";
import PlatformMark from "@/components/brand/PlatformMark";
import { ArrowUpRight } from "lucide-react";
import FlipFadeText from "@/components/ui/flip-fade-text";

const offerings: Offering[] = [
  {
    title: "YouTube video editing",
    description:
      "Turn your footage into a structured video with clear pacing, useful graphics, and clean transitions.",
    features: [
      "Footage selection and cuts",
      "Titles and supporting graphics",
      "Exports ready for YouTube",
    ],
    subject: "YouTube Editing",
  },
  {
    title: "Reels & short clips",
    description:
      "Create short, focused videos from your footage for Instagram Reels, YouTube Shorts, and other channels.",
    features: ["Vertical video formats", "On-screen captions", "Clips from longer videos"],
    subject: "Reels/Shorts",
  },
  {
    title: "Product review videos",
    description:
      "Organise demonstrations, comparisons, and product details so viewers can understand what is being shown.",
    features: ["Product footage editing", "Feature callouts", "Comparison layouts"],
    subject: "Product Review Videos",
  },
  {
    title: "Thumbnails & titles",
    description:
      "Help viewers understand what your video covers with a clear thumbnail and a relevant title.",
    features: ["Thumbnail design", "Readable text", "A consistent channel style"],
    subject: "Thumbnail Design",
  },
  {
    title: "Audio & colour",
    description:
      "Make voices easier to follow and bring footage from different sources into a consistent visual style.",
    features: ["Background noise cleanup", "Audio level balancing", "Colour correction"],
    subject: "Audio & Colour Editing",
  },
  {
    title: "Captions & delivery",
    description: "Finish your videos in the sizes and file formats you need for each channel.",
    features: ["Caption formatting", "Aspect ratio adjustments", "Final export checks"],
    subject: "Captions & Video Delivery",
  },
];

const channels = [
  {
    name: "BrajBuzzTech",
    href: "https://www.youtube.com/@BrajBuzzTech",
    description: "Phones, gadgets, and product comparisons.",
  },
  {
    name: "Liklet Tech",
    href: "https://www.youtube.com/@liklet_tech",
    description: "Tech reviews, software tips, and setup guides.",
  },
];
export default function VideoEditing() {
  return (
    <ServicePage
      label="04 / Video editing"
      title={
        <>
          Video Editing That
          <span className="block">
            <FlipFadeText
              words={["Respects Your Viewers", "Keeps People Watching", "Builds Trust"]}
              interval={2600}
              className="max-w-full text-2xl sm:text-3xl lg:text-4xl"
            />
          </span>
        </>
      }
      intro={
        <>
          Video Editing{" "}
          <FlipFadeText words={["For You", "With Care", "Every Week"]} interval={2500} />
        </>
      }
      description="YouTube edits, short clips, product reviews, and thumbnails. We shape your footage into a clear story and prepare it for the platforms where you publish."
      contactHref="/video-editing/contact"
      offerings={offerings}
    >
      <section className="section-padding border-t border-border bg-card">
        <div className="container-max">
          <p className="eyebrow">On YouTube</p>
          <h2 className="section-title mt-3">
            Our Channels{" "}
            <FlipFadeText words={["In Action", "On YouTube", "Come Alive"]} interval={2600} />
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {channels.map((channel) => (
              <a
                key={channel.name}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-border p-6 sm:p-8"
              >
                <div className="flex items-center justify-between gap-5">
                  <PlatformMark slug="youtube" />
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-5 w-5 text-muted-foreground group-hover:text-accent"
                  />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold">{channel.name}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {channel.description}
                </p>
                <span className="mt-5 inline-block text-sm font-semibold text-accent">
                  Visit channel
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </ServicePage>
  );
}

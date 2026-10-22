import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import ServicePage, { Offering } from "@/components/marketing/ServicePage";
import FlipFadeText from "@/components/ui/flip-fade-text";

const offerings: Offering[] = [
  {
    title: "Search engine optimisation (SEO)",
    description:
      "Help customers find your business when they search for your products or services.",
    features: [
      "Website and search review",
      "Page titles and content",
      "Technical SEO improvements",
      "Local search visibility",
    ],
    subject: "SEO",
  },
  {
    title: "Google Ads",
    description:
      "Reach people who are actively searching for what you offer, with a campaign built around your budget.",
    features: [
      "Keyword and audience planning",
      "Ad copy and landing pages",
      "Conversion tracking",
      "Campaign reviews",
    ],
    subject: "Google Ads",
  },
  {
    title: "Facebook & Instagram ads",
    description:
      "Introduce your products or services to relevant audiences with clear creative and a defined campaign goal.",
    features: ["Audience planning", "Ad images and copy", "Campaign setup", "Retargeting"],
    subject: "Meta Ads",
  },
  {
    title: "Lead generation",
    description:
      "Give interested people a straightforward way to enquire, book a call, or request a quote.",
    features: ["Landing pages", "Enquiry forms", "Call and message tracking", "CRM connections"],
    subject: "Lead Generation",
  },
  {
    title: "Email marketing",
    description:
      "Keep customers informed with useful updates, welcome emails, and follow-up messages.",
    features: [
      "Email design and copy",
      "Audience segmentation",
      "Welcome and follow-up emails",
      "Campaign reporting",
    ],
    subject: "Email Marketing",
  },
  {
    title: "Reporting & measurement",
    description: "Understand where enquiries come from and how your campaigns are performing.",
    features: [
      "Analytics setup",
      "Conversion events",
      "Spend and enquiry reports",
      "Recommendations for the next month",
    ],
    subject: "Analytics & Reporting",
  },
];

export default function DigitalMarketing() {
  return (
    <ServicePage
      label="03 / Digital marketing"
      title={
        <>
          Stop Guessing.
          <span className="block">
            Start <FlipFadeText words={["Growing.", "Scaling.", "Winning."]} interval={2400} />
          </span>
        </>
      }
      intro={
        <>
          Digital Marketing{" "}
          <FlipFadeText words={["Services", "Systems", "Strategy"]} interval={2400} />
        </>
      }
      description="Search, advertising, and email campaigns with a clear purpose. We help you choose the channels that fit your business, set up measurement, and review what the work is delivering."
      contactHref="/digital-marketing/contact"
      offerings={offerings}
      aside={
        <>
          <p className="text-sm font-semibold">Start with a goal and a budget.</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Tell us whether you need enquiries, online sales, local visits, or a clearer picture of
            your existing campaigns.
          </p>
        </>
      }
    >
      <TestimonialsSection variant="marketing" />
    </ServicePage>
  );
}

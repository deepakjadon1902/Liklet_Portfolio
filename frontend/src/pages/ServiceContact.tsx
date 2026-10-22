import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EnquiryForm from "@/components/marketing/EnquiryForm";
import FlipFadeText from "@/components/ui/flip-fade-text";

const servicePaths: Record<string, string> = {
  "IT Services": "/it-services",
  "Social Media Marketing": "/social-media-marketing",
  "Digital Marketing": "/digital-marketing",
  "Video Editing & Reviews": "/video-editing",
};

export default function ServiceContact({
  pageTitle,
  defaultSubject,
}: {
  pageTitle: string;
  defaultSubject: string;
}) {
  return (
    <section className="section-padding">
      <div className="container-max max-w-5xl">
        <Link
          to={servicePaths[pageTitle] || "/contact"}
          className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to {pageTitle.toLowerCase()}
        </Link>
        <div className="mt-8 grid gap-9 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12">
          <div>
            <p className="eyebrow">{pageTitle}</p>
            <h1 className="page-title mt-5 !text-4xl md:!text-5xl">
              Contact <FlipFadeText words={["Us", "Liklet", "Our Team"]} interval={2400} />
            </h1>
            <p className="mt-5 leading-8 text-muted-foreground">
              {pageTitle === "IT Services"
                ? "Need a website, mobile app, CRM, or online store? Tell us what your business needs and we'll help you choose the right approach."
                : "Tell us about your business, what you need help with, and any timing you have in mind."}
            </p>
            <p className="mt-7 text-sm leading-7 text-muted-foreground">
              Prefer to talk directly?
              <br />
              <a
                href="mailto:support@liklet.com"
                className="font-medium text-accent hover:underline"
              >
                support@liklet.com
              </a>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
            <EnquiryForm key={pageTitle} pageTitle={pageTitle} defaultSubject={defaultSubject} />
          </div>
        </div>
      </div>
    </section>
  );
}

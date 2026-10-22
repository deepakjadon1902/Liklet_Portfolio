import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { projectSteps } from "@/data/services";
import FlipFadeText from "@/components/ui/flip-fade-text";

export type Offering = {
  title: string;
  description: string;
  features?: string[];
  subject?: string;
};

export function ProjectProcess() {
  return (
    <section className="section-padding border-t border-border bg-background">
      <div className="container-max">
        <p className="eyebrow">The process</p>
        <h2 className="section-title mt-3">
          Our <FlipFadeText words={["Workflow", "Process", "System"]} interval={2400} />
        </h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-12">
          {projectSteps.map((step, index) => (
            <li key={step.title} className="border-t border-border pt-5">
              <span className="text-xs font-semibold tabular-nums text-accent">0{index + 1}</span>
              <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ProjectCta({
  href = "/contact",
  title = (
    <>
      Let's talk about your <FlipFadeText words={["Business", "Goals", "Growth"]} interval={2400} />
    </>
  ),
  description = "Tell us about your business, your idea, and what you would like to improve.",
}: {
  href?: string;
  title?: ReactNode;
  description?: string;
}) {
  return (
    <section className="section-padding border-t border-border bg-card">
      <div className="container-max flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="section-title">{title}</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{description}</p>
        </div>
        <Link to={href} className="btn-accent shrink-0 self-start md:self-auto">
          Discuss your project <ArrowRight aria-hidden="true" className="ml-3 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export default function ServicePage({
  label,
  title,
  description,
  contactHref,
  offerings,
  children,
  aside,
  intro = "What we can help you with",
}: {
  label: string;
  title: ReactNode;
  description: string;
  contactHref: string;
  offerings: Offering[];
  children?: ReactNode;
  aside?: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <>
      <section className="section-padding border-b border-border bg-card">
        <div className="container-max grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:gap-20">
          <div>
            <p className="eyebrow">{label}</p>
            <h1 className="page-title mt-5 max-w-4xl">{title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p>
            <Link to={contactHref} className="btn-accent mt-8">
              Discuss your project <ArrowRight aria-hidden="true" className="ml-3 h-4 w-4" />
            </Link>
          </div>
          <aside className="border-l-2 border-accent pl-6">
            {aside || (
              <>
                <p className="text-sm font-semibold">Start with the problem you want to solve.</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  You don't need a technical brief. Tell us how your business works and we'll help
                  you put the right plan together.
                </p>
              </>
            )}
          </aside>
        </div>
      </section>
      <section className="section-padding bg-background" id="services">
        <div className="container-max">
          <p className="eyebrow">Our services</p>
          <h2 className="section-title mt-3">{intro}</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((offering, index) => (
              <article key={offering.title} className="flex flex-col bg-card p-6 sm:p-8">
                <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold leading-snug tracking-tight">
                  {offering.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {offering.description}
                </p>
                {offering.features && (
                  <ul className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
                    {offering.features.map((feature) => (
                      <li key={feature} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                {offering.subject && (
                  <Link
                    to={`${contactHref}?subject=${encodeURIComponent(offering.subject)}`}
                    className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-accent hover:underline"
                  >
                    Ask about this <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
      {children}
      <ProjectProcess />
      <ProjectCta href={contactHref} />
    </>
  );
}

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { serviceLinks } from "@/data/services";
import { ProjectCta, ProjectProcess } from "@/components/marketing/ServicePage";
import FlipFadeText from "@/components/ui/flip-fade-text";

const principles = [
  {
    title: "Understand the work",
    description:
      "You should know what we're building, what each service includes, and what decisions you need to make.",
  },
  {
    title: "Agree on the details",
    description:
      "Scope, cost, deliverables, and timelines belong in the conversation before a project starts.",
  },
  {
    title: "Review along the way",
    description:
      "Feedback is part of the work. We make room to review progress and agree on the next steps.",
  },
  {
    title: "Make it useful",
    description:
      "A website, an app, or a campaign should serve a clear purpose for your customers and your team.",
  },
];

export default function About() {
  return (
    <>
      <section className="section-padding border-b border-border bg-card">
        <div className="container-max grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div>
            <p className="eyebrow">About Liklet</p>
            <h1 className="page-title mt-5">
              We Help Small Businesses
              <span className="block text-2xl sm:text-3xl lg:text-4xl">
                <FlipFadeText
                  words={["Win Big Online", "Grow With Clarity", "Stand Out Online"]}
                  interval={2600}
                />
              </span>
            </h1>
          </div>
          <div className="self-end space-y-5 text-lg leading-8 text-muted-foreground">
            <p>
              Liklet brings development, content, and marketing together to help businesses build
              and manage their online presence.
            </p>
            <p>
              We work on the things your customers use and see: websites, mobile apps, online
              stores, social posts, advertising, and video.
            </p>
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-max">
          <p className="eyebrow">How we work</p>
          <h2 className="section-title mt-3">
            What We <FlipFadeText words={["Stand For", "Believe In", "Protect"]} interval={2500} />
          </h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {principles.map((item, index) => (
              <article key={item.title} className="border-t border-border pt-5">
                <span className="text-xs tabular-nums text-accent">0{index + 1}</span>
                <h3 className="mt-5 font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding border-y border-border bg-card">
        <div className="container-max grid gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <p className="eyebrow">What we do</p>
            <h2 className="section-title mt-3">
              One project.
              <br />
              Or a connected plan.
            </h2>
            <p className="mt-5 max-w-md leading-7 text-muted-foreground">
              You might need a new website, regular content, or help connecting your tools. Start
              with the service that fits the task.
            </p>
          </div>
          <div>
            {serviceLinks.map((service) => (
              <Link
                key={service.path}
                to={service.path}
                className="flex items-center justify-between gap-5 border-t border-border py-5 font-semibold hover:text-accent"
              >
                {service.title}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ProjectProcess />
      <ProjectCta />
    </>
  );
}

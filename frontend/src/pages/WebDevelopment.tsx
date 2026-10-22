import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import ServicePage, { Offering } from "@/components/marketing/ServicePage";
import { websiteProjects } from "@/data/services";
import FlipFadeText from "@/components/ui/flip-fade-text";

const offerings: Offering[] = [
  {
    title: "Websites & landing pages",
    description:
      "A clear online home for your business, services, or portfolio, with a simple way for visitors to get in touch.",
    features: [
      "Business and portfolio websites",
      "Campaign landing pages",
      "Contact and enquiry forms",
      "Pages that work on phones",
    ],
    subject: "Business Website",
  },
  {
    title: "Mobile applications",
    description:
      "Android and iPhone apps that help customers book services, place orders, or stay connected with your business.",
    features: [
      "Customer accounts",
      "Bookings and orders",
      "App notifications",
      "An interface designed for phones",
    ],
    subject: "Mobile Application",
  },
  {
    title: "CRM & customer management",
    description:
      "Customer relationship management (CRM) software keeps enquiries, customer details, and sales follow-ups in one place.",
    features: [
      "Customer contact records",
      "Lead and sales tracking",
      "Follow-up reminders",
      "Reports for your team",
    ],
    subject: "CRM & Customer Management",
  },
  {
    title: "Online stores",
    description:
      "An e-commerce website where customers can explore your products, make payments, and view their orders.",
    features: [
      "Product catalogs",
      "Shopping cart and checkout",
      "Online payments",
      "Order and stock management",
    ],
    subject: "Online Store (E-commerce)",
  },
  {
    title: "Booking & appointment systems",
    description:
      "Let customers book appointments, rooms, classes, or services while your team manages availability.",
    features: [
      "Online bookings",
      "Availability calendars",
      "Booking confirmations",
      "Appointment reminders",
    ],
    subject: "Booking & Appointment System",
  },
  {
    title: "Custom business software",
    description:
      "Tools built around your everyday work, from stock tracking and billing to staff management and reporting.",
    features: [
      "Business dashboards",
      "Inventory and billing",
      "Staff and task management",
      "Reports and automation",
    ],
    subject: "Custom Business Software",
  },
];

export default function WebDevelopment() {
  return (
    <ServicePage
      label="01 / IT services"
      title={
        <>
          Websites, Apps & CRM
          <span className="block">
            <FlipFadeText
              words={["Built for You", "Made Simple", "Ready to Grow"]}
              interval={2600}
            />
          </span>
        </>
      }
      description="From your first website to a CRM for your sales team, we turn everyday business needs into tools people can use. We'll help you plan the features, build the product, and keep it working."
      offerings={offerings}
      contactHref="/it-services/contact"
      intro={
        <>
          What Can We{" "}
          <FlipFadeText
            words={["Build for You?", "Help You With?", "Create for You?"]}
            interval={2600}
          />
        </>
      }
    >
      <TestimonialsSection variant="it" />
      <section id="work" className="section-padding scroll-mt-24 border-t border-border bg-card">
        <div className="container-max">
          <p className="eyebrow">Website work</p>
          <h2 className="section-title mt-3">
            Featured <FlipFadeText words={["Projects", "Work", "Builds"]} interval={2400} />
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            Explore website and application previews from the project portfolio.
          </p>
          <div className="mt-10 grid gap-x-7 gap-y-10 md:grid-cols-2">
            {websiteProjects.map((project) => (
              <figure key={project.title}>
                <div className="overflow-hidden rounded-lg border border-border bg-background">
                  <img
                    src={project.image}
                    alt={project.title + " website preview"}
                    loading="lazy"
                    width={1342}
                    height={676}
                    className="aspect-[2/1] w-full object-cover object-top"
                  />
                </div>
                <figcaption className="mt-4">
                  <p className="text-xs text-muted-foreground">{project.category}</p>
                  <h3 className="mt-1 font-display text-xl font-semibold">{project.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {project.description}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding border-t border-border">
        <div className="container-max grid gap-6 md:grid-cols-2 md:gap-16">
          <div>
            <p className="eyebrow">After launch</p>
            <h2 className="section-title mt-3">Support for the tools you use.</h2>
          </div>
          <div className="space-y-5 text-sm leading-7 text-muted-foreground">
            <p>
              Need a redesign, a bug fix, or a new feature? We can help you improve an existing
              website or app as well as build something new.
            </p>
            <p>
              We also set up content management systems (CMS) so you can edit your own pages, and
              connect payment services, email, WhatsApp, and other business tools.
            </p>
          </div>
        </div>
      </section>
    </ServicePage>
  );
}

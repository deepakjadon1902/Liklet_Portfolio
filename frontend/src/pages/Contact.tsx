import { Link } from "react-router-dom";
import { Clock, Mail, MapPin } from "lucide-react";
import EnquiryForm from "@/components/marketing/EnquiryForm";
import FlipFadeText from "@/components/ui/flip-fade-text";

const iconClass =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent";

export default function Contact() {
  return (
    <section className="section-padding">
      <div className="container-max grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow">Get in touch</p>
          <h1 className="section-title mt-4">
            Contact <FlipFadeText words={["Information", "Details", "Our Team"]} interval={2600} />
          </h1>
          <dl className="mt-8 space-y-7">
            <div className="flex items-start gap-4">
              <span className={iconClass}>
                <MapPin aria-hidden="true" className="h-6 w-6" />
              </span>
              <div>
                <dt className="text-base font-semibold">Our Office - USA</dt>
                <dd className="mt-1 text-base leading-7 text-muted-foreground">
                  <address className="not-italic">
                    2020 Forestview Road, Apt#206
                    <br />
                    Rockford, IL-61108
                  </address>
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className={iconClass}>
                <MapPin aria-hidden="true" className="h-6 w-6" />
              </span>
              <div>
                <dt className="text-base font-semibold">Our Office - India</dt>
                <dd className="mt-1 text-base leading-7 text-muted-foreground">
                  <address className="not-italic">
                    Uttar Pradesh
                    <br />
                    281121
                    <br />
                    India
                  </address>
                  <a href="tel:+919634359003" className="mt-1 inline-block hover:text-accent">
                    +91 9634359003
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className={iconClass}>
                <Mail aria-hidden="true" className="h-6 w-6" />
              </span>
              <div>
                <dt className="text-base font-semibold">Email</dt>
                <dd className="mt-1 leading-7 text-muted-foreground">
                  <a href="mailto:support@liklet.com" className="break-words hover:text-accent">
                    support@liklet.com
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className={iconClass}>
                <Clock aria-hidden="true" className="h-6 w-6" />
              </span>
              <div>
                <dt className="text-base font-semibold">Business Hours</dt>
                <dd className="mt-1 leading-7 text-muted-foreground">
                  <p>Monday - Friday: 9AM - 6PM</p>
                  <p>Saturday: 10AM - 4PM</p>
                  <p>Sunday: Closed</p>
                </dd>
              </div>
            </div>
          </dl>
          <div className="mt-8 border-t border-border pt-6">
            <a
              href="https://wa.me/919634359003"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-accent underline underline-offset-4"
            >
              Start a WhatsApp chat
            </a>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Not sure what you need?{" "}
              <Link to="/it-services" className="text-accent underline underline-offset-4">
                See what we build
              </Link>{" "}
              or choose "Help Me Choose" in the form.
            </p>
          </div>
        </div>
        <div className="min-w-0 rounded-xl border border-border bg-card p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Send Us a Message</h2>
          <p className="mb-7 mt-3 text-sm leading-7 text-muted-foreground">
            Tell us about your project and how we can reach you.
          </p>
          <EnquiryForm pageTitle="Contact" phoneRequired />
        </div>
      </div>
    </section>
  );
}

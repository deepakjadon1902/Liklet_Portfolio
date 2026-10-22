import { motion } from "framer-motion";
import FlipFadeText from "@/components/ui/flip-fade-text";
import TestimonialMarquee from "@/components/ui/marquee-01";

const sectionCopy = {
  home: {
    label: "Real Stories",
    heading: "Business Owners",
    words: ["Like You", "Who Grow", "Who Lead"],
    interval: 2600,
    description:
      "Don't just take our word for it - hear from real clients who grew their businesses with our help.",
  },
  it: {
    label: "Testimonials",
    heading: "What Our Clients",
    words: ["Say", "Value", "Remember"],
    interval: 2400,
    description: "Don't just take our word for it - hear from our satisfied clients.",
  },
  social: {
    label: "Testimonials",
    heading: "Client Reviews &",
    words: ["Ratings", "Results", "Trust"],
    interval: 2400,
    description: "See what our clients say about our social media marketing services.",
  },
  marketing: {
    label: "Testimonials",
    heading: "Client Reviews &",
    words: ["Ratings", "Results", "Trust"],
    interval: 2400,
    description: "See what our clients say about our digital marketing services.",
  },
};

export default function TestimonialsSection({
  variant = "home",
}: {
  variant?: keyof typeof sectionCopy;
}) {
  const copy = sectionCopy[variant];
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className={
        variant === "home" ? "bg-card section-padding" : "section-gradient section-padding"
      }
    >
      <div className="container-max">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-medium">{copy.label}</span>
            <h2
              id="testimonials-heading"
              className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2"
            >
              {copy.heading} <FlipFadeText words={copy.words} interval={copy.interval} />
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{copy.description}</p>
          </motion.div>
        </div>
        <TestimonialMarquee />
      </div>
    </section>
  );
}

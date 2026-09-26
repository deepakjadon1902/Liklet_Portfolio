import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Code, TrendingUp, Users, CheckCircle, Star, PlayCircle } from "lucide-react";
import FlipFadeText from "@/components/ui/flip-fade-text";
import TestimonialMarquee from "@/components/ui/marquee-01";
import ServicesMarquee from "@/components/ui/services-marquee";
import webDevImg from "@/assets/web-dev.jpg";
import socialMediaImg from "@/assets/social-media.jpg";
import digitalMarketingImg from "@/assets/digital-marketing.jpg";
import youtubeImg from "@/assets/youtube.jpg";

const heroVideos = [
  "/hero%20section/development.mp4",
  "/hero%20section/Socialmedia.mp4",
  "/hero%20section/digitalmarketing.mp4",
];

const services = [
  {
    icon: Code,
    title: "IT Services",
    description: "Get a website that actually brings you customers - fast, mobile-friendly, and built to convert visitors into leads.",
    link: "/it-services",
    image: webDevImg,
  },
  {
    icon: Users,
    title: "Social Media Marketing",
    description: "Stop posting into the void. We create content that gets noticed, builds your following, and turns followers into paying customers.",
    link: "/social-media-marketing",
    image: socialMediaImg,
  },
  {
    icon: TrendingUp,
    title: "Digital Marketing",
    description: "Tired of wasting money on ads that don't work? We create marketing campaigns that deliver real, measurable growth.",
    link: "/digital-marketing",
    image: digitalMarketingImg,
  },
  {
    icon: PlayCircle,
    title: "Video Editing & Reviews",
    description: "Engaging YouTube edits and honest tech reviews that keep viewers watching and help them decide.",
    link: "/video-editing",
    image: youtubeImg,
  },
];

const stats = [
  { value: "150+", label: "Businesses Helped" },
  { value: "50+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "98%", label: "Client Satisfaction" },
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    company: "TechStart India",
    content: "We struggled for years to get leads from our website. Within 3 months of working with Liklet, our inquiries doubled. They truly understand small business needs.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    company: "Fashion Forward",
    content: "I was skeptical about social media marketing until Liklet took over. Our Instagram following grew by 10x and we're now getting orders directly from DMs!",
    rating: 5,
  },
  {
    name: "Amit Patel",
    company: "GrowthHub",
    content: "Finally, a marketing team that speaks in results, not jargon. They showed us exactly where our money was going and the ROI we were getting.",
    rating: 5,
  },
];

const HeroVideoBackground = () => {
  const videoRefs = [useRef<HTMLVideoElement | null>(null), useRef<HTMLVideoElement | null>(null)];
  const [activeSlot, setActiveSlot] = useState(0);
  const [slotIndexes, setSlotIndexes] = useState<[number, number]>([0, 1]);

  useEffect(() => {
    videoRefs[activeSlot].current?.play().catch(() => undefined);
  }, [activeSlot, slotIndexes]);

  const handleEnded = () => {
    const nextSlot = activeSlot === 0 ? 1 : 0;

    setActiveSlot(nextSlot);
    setSlotIndexes((current) => {
      const updated: [number, number] = [...current];
      updated[activeSlot] = (current[nextSlot] + 1) % heroVideos.length;
      return updated;
    });

    requestAnimationFrame(() => {
      const nextVideo = videoRefs[nextSlot].current;
      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.play().catch(() => undefined);
      }
    });
  };

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-black">
      {slotIndexes.map((videoIndex, slot) => (
        <video
          key={`${slot}-${videoIndex}`}
          ref={videoRefs[slot]}
          src={heroVideos[videoIndex]}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-150 ${
            slot === activeSlot ? "opacity-100" : "opacity-0"
          }`}
          style={{ filter: "brightness(1.38) saturate(1.08) contrast(1.02)" }}
          muted
          playsInline
          preload="auto"
          autoPlay={slot === activeSlot}
          onEnded={slot === activeSlot ? handleEnded : undefined}
        />
      ))}
      <div className="absolute inset-0 bg-white/38" />
    </div>
  );
};

const Index = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-black">
        <HeroVideoBackground />
        
        <div className="container-max relative z-10 px-4 pb-14 pt-28 text-center sm:px-6 md:pb-20 md:pt-32 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-block rounded-full border border-black/15 bg-white/80 px-4 py-2 text-sm font-extrabold text-black shadow-sm backdrop-blur-md mb-6">
              For Growing Businesses
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-black mb-6 leading-tight">
              Your Business{" "}
              <FlipFadeText
                words={["Deserves", "Needs", "Is Ready"]}
                interval={2600}
                className="align-baseline"
              />
              <span className="block text-black">To Be Found Online</span>
            </h1>
            <p className="text-lg md:text-xl font-semibold text-black/82 mb-8 max-w-2xl mx-auto">
              We help startups, small businesses, and entrepreneurs get more customers through websites that convert, social media that engages, and marketing that actually works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-accent text-lg">
                Get a Free Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-lg border border-foreground/15 bg-white/70 px-6 py-3 font-semibold text-foreground shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white"
              >
                See How We Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card py-16">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-display font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-gradient section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">How We Help</span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2">
                Grow Your{" "}
                <FlipFadeText words={["Business", "Brand", "Revenue"]} interval={2400} />{" "}
                Online
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                Whether you're just starting out or ready to scale, we have the tools and expertise to help you succeed. No complicated tech talk - just real results.
              </p>
            </motion.div>
          </div>

          <ServicesMarquee services={services} />
        </div>
      </section>

      {/* Who We Help */}
      <section className="bg-card section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Who We Help</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Built for{" "}
                <FlipFadeText words={["Business Owners", "Founders", "Creators"]} interval={2600} />{" "}
                Like You
              </h2>
              <p className="text-muted-foreground mb-8">
                You're busy running your business. You don't have time to figure out websites, social media algorithms, or Google Ads. That's where we come in - we handle your entire online presence so you can focus on what you do best.
              </p>
              <ul className="space-y-4">
                {[
                  "Startups ready to launch their first website",
                  "Small businesses wanting more local customers",
                  "E-commerce stores looking to increase sales",
                  "Service providers needing consistent leads",
                  "Entrepreneurs building their personal brand",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <Link to="/about" className="btn-accent mt-8 inline-flex">
                Learn About Our Approach
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src={webDevImg}
                  alt="Business owner working with laptop"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-display font-bold">150+</div>
                <div className="text-sm">Businesses Helped</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="hero-gradient section-padding">
        <div className="container-max">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-highlight font-medium">Our Promise</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mt-2 mb-6">
                What Makes Us{" "}
                <FlipFadeText words={["Different", "Clearer", "Better"]} interval={2400} />
              </h2>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                {[
                  { title: "No Jargon", desc: "We explain everything in plain language. If you don't understand it, we'll make it clearer." },
                  { title: "Real Results", desc: "We focus on what matters: more visitors, more leads, more customers. Not vanity metrics." },
                  { title: "Your Partner", desc: "We're not a vendor - we're an extension of your team. Your success is our success." },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <h3 className="text-xl font-bold text-primary-foreground mb-2">{item.title}</h3>
                    <p className="text-primary-foreground/80">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Real Stories</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Business Owners{" "}
                <FlipFadeText words={["Like You", "Who Grow", "Who Lead"]} interval={2600} />
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Don't just take our word for it - hear from real clients who grew their businesses with our help.
              </p>
            </motion.div>
          </div>

          <TestimonialMarquee />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent section-padding">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
              Ready to Get More{" "}
              <FlipFadeText words={["Customers?", "Leads?", "Growth?"]} interval={2400} />
            </h2>
            <p className="text-accent-foreground/80 max-w-2xl mx-auto mb-8">
              Let's have a conversation about your business goals. No pressure, no sales pitch - just honest advice on how we can help you grow.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-primary-foreground text-primary font-medium hover:scale-105 transition-transform"
            >
              Book a Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;

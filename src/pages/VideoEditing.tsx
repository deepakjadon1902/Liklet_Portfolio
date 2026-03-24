import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Cpu,
  Film,
  Gauge,
  Headphones,
  MessageSquare,
  Mic2,
  PlayCircle,
  Scissors,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ThumbsUp,
  Youtube,
} from "lucide-react";
import youtubeImg from "@/assets/youtube.jpg";

const editServices = [
  {
    icon: Scissors,
    title: "Story-First Editing",
    description:
      "Tight pacing, clean cuts, and intentional flow so viewers stay for the full video.",
  },
  {
    icon: Mic2,
    title: "Crisp Audio Cleanup",
    description:
      "Noise removal, leveling, and clarity boosts so your voice is always easy to follow.",
  },
  {
    icon: Sparkles,
    title: "Polished Visuals",
    description:
      "Color balancing, graphics, and subtle motion that feels premium without being distracting.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description:
      "We keep your upload schedule consistent with efficient workflows and clear timelines.",
  },
  {
    icon: ShieldCheck,
    title: "Brand Consistency",
    description:
      "Titles, thumbnails, lower-thirds, and style guidelines that keep your channel recognizable.",
  },
  {
    icon: MessageSquare,
    title: "Audience-Focused Cuts",
    description:
      "We edit around questions real viewers ask, so the content feels helpful and human.",
  },
];

const reviewPillars = [
  {
    icon: Cpu,
    title: "Real-World Performance",
    points: [
      "Speed, thermals, and multitasking",
      "Gaming and creative workloads",
      "Consistency over time",
    ],
  },
  {
    icon: Smartphone,
    title: "Everyday Experience",
    points: [
      "Display, speakers, haptics",
      "Battery life and charging",
      "Camera and video quality",
    ],
  },
  {
    icon: Headphones,
    title: "Honest Value Check",
    points: [
      "Price vs competitors",
      "Who should buy it",
      "Who should skip it",
    ],
  },
];

const workflowSteps = [
  {
    title: "Plan the Angle",
    description:
      "We start with the viewer question: What should they know before buying?",
  },
  {
    title: "Edit for Clarity",
    description:
      "Trim the fluff, highlight the proof, and keep the narrative smooth.",
  },
  {
    title: "Review + Revise",
    description:
      "We fact-check, tune the pacing, and finalize titles, captions, and thumbnails.",
  },
  {
    title: "Publish With Purpose",
    description:
      "Deliverables ready for YouTube with short clips for reels and shorts.",
  },
];

const channels = [
  {
    name: "BrajBuzzTech",
    url: "https://www.youtube.com/@BrajBuzzTech",
    focus:
      "Latest phones, smart gadgets, and quick buyer-friendly breakdowns.",
    highlights: [
      "Fast comparisons",
      "Hands-on demos",
      "Clear buying advice",
    ],
  },
  {
    name: "Liklet Tech",
    url: "https://www.youtube.com/@liklet_tech",
    focus:
      "In-depth tech reviews, software tips, and practical setup guides.",
    highlights: [
      "Long-form reviews",
      "Creator workflows",
      "Helpful tutorials",
    ],
  },
];

const VideoEditing = () => {
  return (
    <div className="overflow-hidden">
      <section
        className="section-padding pt-32 relative"
        style={{
          background:
            "linear-gradient(135deg, hsl(215 50% 15%) 0%, hsl(215 50% 23%) 45%, #ff0033 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#ff0033] blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-highlight blur-[100px]" />
        </div>
        <div className="container-max relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white text-sm font-medium mb-6">
                <Youtube className="w-4 h-4" />
                YouTube Editing + Tech Reviews
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Video Editing That
                <span className="block text-highlight">Respects Your Viewers</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8">
                We craft clean, engaging edits and honest tech reviews that make
                buying decisions easier. Every cut, graphic, and caption is
                designed to help your audience feel confident and informed.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.youtube.com/@BrajBuzzTech"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #ff0033 0%, #ff5f5f 100%)",
                    boxShadow: "0 12px 28px -12px rgba(255, 0, 51, 0.6)",
                  }}
                >
                  Watch on YouTube
                  <PlayCircle className="w-5 h-5 ml-2" />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium text-white border border-white/40 hover:bg-white/10 transition-all duration-300"
                >
                  Plan a Video
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border border-white/10">
                <img
                  src={youtubeImg}
                  alt="Video editing and YouTube production"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-card section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Editing Services</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                What We Handle For You
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                You stay focused on creating. We take care of pacing, polish, and
                delivery so every upload feels intentional and professional.
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {editServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="card-premium p-6"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #ff0033 0%, hsl(200 90% 60%) 100%)",
                    boxShadow: "0 12px 28px -16px rgba(255, 0, 51, 0.6)",
                  }}
                >
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gradient section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Tech Review Focus</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Our Review Framework
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                We review like a buyer, not a brand. Every verdict is built on
                real-world testing and honest trade-offs.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviewPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <pillar.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {pillar.title}
                </h3>
                <ul className="space-y-2">
                  {pillar.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-foreground/80">
                      <CheckCircle className="w-4 h-4 text-[#ff0033] mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Production Flow</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                A Clean, Reliable Workflow
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                We keep the process simple and transparent so you always know
                what is happening and what comes next.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium p-6"
              >
                <div className="text-sm font-semibold text-[#ff0033] mb-2">
                  Step {index + 1}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gradient section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Our Channels</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Watch The Work In Action
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                Explore our two YouTube channels for tech reviews, product
                breakdowns, and creator-friendly tutorials.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {channels.map((channel, index) => (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium p-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#ff0033]/10 flex items-center justify-center">
                    <Film className="w-6 h-6 text-[#ff0033]" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {channel.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {channel.focus}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {channel.highlights.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <a
                  href={channel.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[#ff0033] font-semibold hover:gap-3 transition-all"
                >
                  Visit Channel
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Viewer-First Promise</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Tech Content That Feels Trustworthy
              </h2>
              <p className="text-muted-foreground mt-4">
                Our edits prioritize clarity, honesty, and pace. We avoid hype,
                highlight trade-offs, and keep the focus on what matters for real
                users.
              </p>
              <ul className="space-y-3 mt-6">
                {[
                  "Simple explanations without jargon",
                  "Balanced pros and cons for every product",
                  "Helpful visuals that guide decision-making",
                  "Consistent branding across every upload",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-foreground/80">
                    <ThumbsUp className="w-5 h-5 text-[#ff0033] mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-premium p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Gauge className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    What Viewers Get
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    A user-centric review experience.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  "Clear timestamps and chapters for easy navigation.",
                  "Side-by-side comparisons to save research time.",
                  "Actionable takeaways for every budget.",
                  "Short-form highlights optimized for social.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#ff0033] mt-0.5" />
                    <span className="text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding hero-gradient">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready for Better Tech Videos?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Let us edit your next review or product video so your audience
              stays engaged and informed.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-primary-foreground text-primary font-medium hover:scale-105 transition-transform"
            >
              Start a Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default VideoEditing;

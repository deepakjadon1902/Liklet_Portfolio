import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import FlipFadeText from "@/components/ui/flip-fade-text";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { serviceLinks, websiteProjects } from "@/data/services";
import { ProjectCta, ProjectProcess } from "@/components/marketing/ServicePage";
import ServiceCardVisual from "@/components/marketing/ServiceCardVisual";

const heroVideos = [
  "/hero%20section/development.mp4",
  "/hero%20section/Socialmedia.mp4",
  "/hero%20section/digitalmarketing.mp4",
];

const HeroVideoBackground = () => {
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const transitionLockRef = useRef(false);
  const resetTimerRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [readyVideos, setReadyVideos] = useState<boolean[]>(() => heroVideos.map(() => false));

  useEffect(() => {
    heroVideos.forEach((_, index) => {
      const video = videoRefs.current[index];
      if (!video) return;

      video.muted = true;
      video.preload = "auto";
      video.load();
    });

    const activeVideo = videoRefs.current[0];
    activeVideo?.play().catch(() => undefined);

    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const playNextVideo = () => {
    if (transitionLockRef.current) return;

    const currentVideo = videoRefs.current[activeIndex];
    const nextIndex = (activeIndex + 1) % heroVideos.length;
    const nextVideo = videoRefs.current[nextIndex];

    if (!nextVideo) return;

    transitionLockRef.current = true;
    nextVideo.currentTime = 0;
    nextVideo.play().catch(() => undefined);

    setActiveIndex(nextIndex);

    resetTimerRef.current = window.setTimeout(() => {
      currentVideo?.pause();
      if (currentVideo) {
        currentVideo.currentTime = 0;
      }
      transitionLockRef.current = false;
    }, 500);
  };

  const handleTimeUpdate = (index: number) => {
    const video = videoRefs.current[index];
    if (!video || index !== activeIndex || !Number.isFinite(video.duration)) return;

    if (video.duration - video.currentTime <= 0.45) {
      playNextVideo();
    }
  };

  const handleVideoReady = (index: number) => {
    setReadyVideos((current) => {
      if (current[index]) return current;
      const next = [...current];
      next[index] = true;
      return next;
    });
  };

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-[linear-gradient(115deg,#050b3d_0%,#2d63d8_42%,#c9fbff_100%)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(255,255,255,0.35),transparent_26%),radial-gradient(circle_at_76%_20%,rgba(255,255,255,0.45),transparent_30%),linear-gradient(115deg,rgba(3,7,36,0.75)_0%,rgba(65,105,225,0.72)_46%,rgba(221,255,255,0.72)_100%)]"
      />
      {heroVideos.map((videoSrc, index) => (
        <video
          key={videoSrc}
          ref={(element) => {
            videoRefs.current[index] = element;
          }}
          src={videoSrc}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${
            index === activeIndex && readyVideos[index] ? "opacity-100" : "opacity-0"
          }`}
          style={{ filter: "brightness(1.38) saturate(1.08) contrast(1.02)" }}
          muted
          playsInline
          preload="auto"
          autoPlay={index === activeIndex}
          onLoadedData={() => handleVideoReady(index)}
          onTimeUpdate={() => handleTimeUpdate(index)}
          onEnded={index === activeIndex ? playNextVideo : undefined}
        />
      ))}
      <div className="absolute inset-0 bg-white/38" />
    </div>
  );
};

export default function Index() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[linear-gradient(115deg,#050b3d_0%,#2d63d8_42%,#c9fbff_100%)]">
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
              We help startups, small businesses, and entrepreneurs get more customers through
              websites that convert, social media that engages, and marketing that actually works.
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
      <section id="services" className="section-padding scroll-mt-24">
        <div className="container-max">
          <div className="grid gap-5 md:grid-cols-2 md:gap-12">
            <div>
              <p className="eyebrow">Our services</p>
              <h2 className="section-title mt-3">
                Grow Your <FlipFadeText words={["Business", "Brand", "Revenue"]} interval={2400} />{" "}
                Online
              </h2>
            </div>
            <p className="max-w-lg self-end leading-7 text-muted-foreground">
              Start with one project or connect several services. We'll help you define the work and
              understand what each part is for.
            </p>
          </div>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {serviceLinks.map((service, index) => (
              <motion.article
                key={service.path}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
                className="h-full"
              >
                <Link
                  to={service.path}
                  aria-label={`Explore ${service.title}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_20px_48px_-30px_rgba(30,64,175,0.5)]"
                >
                  <div className="aspect-video w-full overflow-hidden border-b border-border/70">
                    <ServiceCardVisual path={service.path} title={service.title} />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-accent">
                        {service.number} / {service.outcome}
                      </span>
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-background text-accent transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                        <ArrowRight
                          aria-hidden="true"
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold">{service.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {service.description}
                    </p>
                    <ul
                      className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 border-t border-border/70 pt-3"
                      aria-label={`${service.title} includes`}
                    >
                      {service.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="relative pl-2.5 text-[11px] font-medium leading-5 text-foreground/70 before:absolute before:left-0 before:top-[0.55rem] before:h-1 before:w-1 before:rounded-full before:bg-accent"
                        >
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding border-y border-border bg-card">
        <div className="container-max">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Website work</p>
              <h2 className="section-title mt-3">A look at what we build.</h2>
            </div>
            <Link
              to="/it-services#work"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
            >
              Explore IT services <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-7 md:grid-cols-2">
            {[websiteProjects[0], websiteProjects[3]].map((project) => (
              <figure key={project.title}>
                <div className="overflow-hidden rounded-lg border border-border bg-background">
                  <img
                    src={project.image}
                    alt={project.title + " website preview"}
                    width={1342}
                    height={676}
                    loading="lazy"
                    className="aspect-[2/1] w-full object-cover object-top"
                  />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="font-semibold">{project.title}</span>
                  <span className="text-xs text-muted-foreground">{project.category}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <ProjectProcess />
      <TestimonialsSection />
      <ProjectCta />
    </>
  );
}

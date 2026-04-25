import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Target, Rocket, Users, ArrowRight } from "lucide-react";
import { LampContainer } from "@/components/ui/lamp-effect";
import teamImg from "@/assets/team.jpg";

const values = [
  {
    icon: Heart,
    title: "Honesty First",
    description: "We tell you what works and what doesn't — even if it means less work for us.",
  },
  {
    icon: Target,
    title: "Results Over Vanity",
    description: "We measure success by your business growth, not just likes and clicks.",
  },
  {
    icon: Users,
    title: "True Partnership",
    description: "Your goals become our goals. We succeed only when you succeed.",
  },
  {
    icon: Rocket,
    title: "Keep It Simple",
    description: "No confusing tech talk. We explain everything in plain language you can understand.",
  },
];

const timeline = [
  { year: "2019", title: "The Beginning", description: "Started with one goal: help small businesses compete online against bigger competitors." },
  { year: "2020", title: "Growing Together", description: "Expanded our services based on what our clients actually needed — not what we wanted to sell." },
  { year: "2021", title: "Recognition", description: "Our clients' success stories started spreading — new businesses found us through referrals." },
  { year: "2022", title: "Full Service", description: "Built a complete team covering web, social media, and marketing — everything under one roof." },
  { year: "2023", title: "Embracing AI", description: "Started using smart tools to get better results faster and at lower costs for our clients." },
  { year: "2024", title: "50+ Happy Clients", description: "Now serving businesses across India and internationally — from local shops to tech startups." },
];

const About = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section with Lamp Effect */}
      <LampContainer className="pt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="text-center"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-6">
            Our Story
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 bg-gradient-to-b from-primary-foreground to-primary-foreground/60 bg-clip-text text-transparent">
            We Help Small Businesses
            <span className="block text-highlight mt-2">Win Big Online</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Too many small businesses struggle to be seen online while big companies dominate. We believe that's not fair — and we're here to change it. At Liklet, we give growing businesses the same digital tools and strategies that big brands use.
          </p>
        </motion.div>
      </LampContainer>

      {/* Our Story */}
      <section className="section-gradient section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <span className="text-accent font-medium">Why We Started</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Built From Frustration
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We started Liklet in 2019 because we saw too many small business owners getting ripped off by digital agencies. They'd pay thousands for websites that didn't bring customers, or social media services that just posted random content.
                </p>
                <p>
                  Our founders came from backgrounds in tech and marketing, and we knew there had to be a better way. A way that focused on what actually matters: getting real customers through the door (or to your website).
                </p>
                <p>
                  Today, we work with startups, local businesses, and entrepreneurs across India and beyond. We're not the biggest agency — and we don't want to be. We'd rather do great work for clients we genuinely care about than chase numbers.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={teamImg}
                  alt="Liklet team"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-card section-padding">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-premium p-8"
            >
              <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                To give small businesses and startups the same digital advantages that big companies have — without the big price tag or confusing jargon. We want every business owner to understand exactly what we're doing and why it works.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="card-premium p-8"
            >
              <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <Rocket className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                A world where business success isn't determined by marketing budget size. Where a local bakery can compete with a franchise chain online. Where good products and services get the visibility they deserve.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-gradient section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">How We Work</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                What We Stand For
              </h2>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-card section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Our Journey</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Milestones That Define Us
              </h2>
            </motion.div>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border hidden md:block" />
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1 text-center md:text-right">
                    {index % 2 === 0 && (
                      <div className="card-premium p-6 inline-block">
                        <div className="text-accent font-bold text-lg">{item.year}</div>
                        <h3 className="font-display text-xl font-semibold text-foreground">{item.title}</h3>
                        <p className="text-muted-foreground mt-2">{item.description}</p>
                      </div>
                    )}
                  </div>
                  <div className="w-4 h-4 rounded-full bg-accent relative z-10 hidden md:block" />
                  <div className="flex-1 text-center md:text-left">
                    {index % 2 !== 0 && (
                      <div className="card-premium p-6 inline-block">
                        <div className="text-accent font-bold text-lg">{item.year}</div>
                        <h3 className="font-display text-xl font-semibold text-foreground">{item.title}</h3>
                        <p className="text-muted-foreground mt-2">{item.description}</p>
                      </div>
                    )}
                  </div>
                  {/* Mobile view */}
                  <div className="md:hidden card-premium p-6 w-full">
                    <div className="text-accent font-bold text-lg">{item.year}</div>
                    <h3 className="font-display text-xl font-semibold text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground mt-2">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient section-padding">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Let's Talk About Your Business
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              No sales pitch. No pressure. Just an honest conversation about where you are, where you want to be, and how we might help you get there.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-primary-foreground text-primary font-medium hover:scale-105 transition-transform"
            >
              Book a Free Call
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;

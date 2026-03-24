import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, BarChart3, Mail, Target, Megaphone, LineChart, ArrowRight, CheckCircle, Star, Quote, Rocket, TrendingUp, PieChart } from "lucide-react";
import digitalMarketingImg from "@/assets/digital-marketing.jpg";

const services = [
  {
    icon: Search,
    title: "Search Engine Optimization",
    description: "Get found when people search for what you offer. We help you show up on Google so customers find you — not your competitors.",
  },
  {
    icon: Target,
    title: "Paid Advertising",
    description: "Stop wasting money on ads that don't work. We create targeted campaigns on Google and Facebook that bring real customers.",
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Turn your email list into a sales machine. We set up automated emails that nurture leads and bring them back to buy.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Know exactly what's working and what's not. We give you clear reports you can actually understand — no confusing charts.",
  },
  {
    icon: Megaphone,
    title: "Content Marketing",
    description: "Attract customers with helpful content that answers their questions. Position yourself as the expert in your field.",
  },
  {
    icon: LineChart,
    title: "Conversion Optimization",
    description: "More visitors don't mean more sales if your website doesn't convert. We fix the leaks in your sales funnel.",
  },
];

const strategies = [
  "SEO Strategy", "Google Ads", "Facebook Ads", "LinkedIn Ads", "Content Strategy",
  "Email Automation", "Retargeting", "Landing Page Optimization", "Analytics Setup",
];

const workTypes = [
  {
    icon: Rocket,
    title: "Growth Marketing",
    description: "For businesses ready to scale fast. We build systems that bring in customers consistently.",
    features: ["Customer Acquisition", "Retention Programs", "Referral Systems", "Lifetime Value Optimization"],
  },
  {
    icon: TrendingUp,
    title: "Performance Marketing",
    description: "Every rupee tracked. We focus on campaigns where you see direct return on investment.",
    features: ["Google Ads", "Facebook & Instagram Ads", "Retargeting", "Conversion Tracking"],
  },
  {
    icon: PieChart,
    title: "Marketing Analytics",
    description: "Make decisions based on data, not guesswork. We show you exactly where your money is going.",
    features: ["Simple Dashboards", "What's Working Reports", "Competitor Insights", "Monthly Reviews"],
  },
];

const clientStories = [
  {
    name: "Anita Rao",
    role: "Founder",
    company: "BrightDent Clinic",
    focus: "More bookings without higher ad spend",
    story:
      "Anita needed predictable patient inquiries, but her ads were expensive and inconsistent. We rebuilt her landing pages, simplified the offer, and focused on local intent keywords.",
    outcomes: [
      "Calendar filled two weeks ahead",
      "Clear call tracking for every campaign",
      "Lower cost per inquiry in 45 days",
    ],
  },
  {
    name: "Sameer Qureshi",
    role: "Owner",
    company: "UrbanFit Gym",
    focus: "Membership growth with a tighter budget",
    story:
      "Sameer wanted steady walk-ins without discount-heavy promotions. We created a content + retargeting system that highlighted real member wins.",
    outcomes: [
      "Consistent trial sign-ups every week",
      "Higher retention from better onboarding emails",
      "Marketing spend shifted to best-performing ads",
    ],
  },
  {
    name: "Meera Singh",
    role: "Marketing Lead",
    company: "CraftKart",
    focus: "E-commerce growth with better ROAS",
    story:
      "Meera needed to scale sales while protecting margins. We optimized product pages, improved email flows, and focused ads on top converters.",
    outcomes: [
      "Repeat customers grew month over month",
      "Faster checkout and fewer drop-offs",
      "Strong ROAS from fewer campaigns",
    ],
  },
];

const results = [
  {
    title: "Local Law Firm",
    client: "LegalExperts",
    description: "A small law firm struggling to get found online. Now ranks #1 for key legal terms in their city.",
    metrics: ["5x more website visitors", "Top 3 on Google for 50+ searches", "Doubled their client inquiries"],
  },
  {
    title: "Home Services Company",
    client: "HomeSolutions",
    description: "Wasting money on ads that didn't work. We rebuilt their campaigns from scratch.",
    metrics: ["4x return on ad spend", "60% lower cost per lead", "1000+ new customer inquiries"],
  },
  {
    title: "Online Education Startup",
    client: "EduTech Pro",
    description: "Had leads but couldn't convert them. We created an email sequence that nurtures and sells.",
    metrics: ["45% email open rate", "3x more course enrollments", "Automated sales while they sleep"],
  },
];

const customerReviews = [
  {
    name: "Arun Kapoor",
    company: "LegalExperts",
    role: "Managing Partner",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    review: "Our organic traffic increased by 500% after working with Liklet. Their SEO strategy is truly world-class and delivered beyond our expectations.",
  },
  {
    name: "Meera Joshi",
    company: "HomeSolutions",
    role: "Marketing Director",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    review: "The PPC campaigns they run for us consistently deliver 400%+ ROAS. Best marketing investment we've ever made.",
  },
  {
    name: "Deepak Sharma",
    company: "EduTech Pro",
    role: "Growth Lead",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    review: "Their email marketing expertise transformed our lead nurturing. We saw a 30% conversion rate from their automated sequences.",
  },
  {
    name: "Priyanka Desai",
    company: "StartupHub",
    role: "CEO",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    review: "Liklet's data-driven approach to marketing has helped us scale from $10K to $100K monthly revenue in just 8 months.",
  },
];

const stats = [
  { value: "500%", label: "Avg Traffic Increase" },
  { value: "350%", label: "Avg ROAS" },
  { value: "60%", label: "Avg Cost Reduction" },
  { value: "98%", label: "Client Satisfaction" },
];

const DigitalMarketing = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="hero-gradient section-padding pt-32">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-6">
                For Growing Businesses
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Stop Guessing.
                <span className="block text-highlight">Start Growing.</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
                Tired of spending money on marketing that doesn't work? We create clear, trackable campaigns that show you exactly where your customers come from — and bring you more of them.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-highlight">{stat.value}</div>
                    <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
              <Link to="/contact" className="btn-accent">
                Grow Your Business
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={digitalMarketingImg}
                  alt="Digital marketing analytics"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Work Types */}
      <section className="bg-card section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">What We Do</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Types of Marketing We Specialize In
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                From growth hacking to performance marketing, we've got you covered.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {workTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="card-premium p-6"
              >
                <motion.div 
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-highlight flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <type.icon className="w-7 h-7 text-accent-foreground" />
                </motion.div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {type.title}
                </h3>
                <p className="text-muted-foreground mb-4">{type.description}</p>
                <ul className="space-y-2">
                  {type.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-gradient section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Our Services</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Digital Marketing Services
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                Comprehensive digital marketing solutions to accelerate your growth.
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="card-premium p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-accent" />
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

      {/* Strategies */}
      <section className="bg-card section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Our Approach</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Marketing Strategies We Deploy
              </h2>
            </motion.div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {strategies.map((strategy, index) => (
              <motion.span
                key={strategy}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="px-6 py-3 rounded-full bg-background border border-border text-foreground font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-default"
              >
                {strategy}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Happy Clients */}
      <section className="bg-card section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Happy Clients</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Real Stories, Real Growth
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                Human-first marketing that respects budgets and delivers clarity
                to the people running the business.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clientStories.map((story, index) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium p-6 relative"
              >
                <Quote className="absolute top-4 right-4 w-7 h-7 text-accent/15" />
                <div className="mb-4">
                  <div className="text-sm text-accent font-medium">{story.company}</div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {story.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{story.role}</p>
                </div>
                <p className="text-sm text-foreground/80 mb-4">
                  <span className="font-semibold text-foreground">Focus:</span>{" "}
                  {story.focus}
                </p>
                <p className="text-muted-foreground mb-5">{story.story}</p>
                <ul className="space-y-2">
                  {story.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-accent mt-0.5" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="section-gradient section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Testimonials</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Client Reviews & Ratings
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                See what our clients say about our digital marketing services.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {customerReviews.map((review, index) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium p-5 relative"
              >
                <Quote className="absolute top-3 right-3 w-6 h-6 text-accent/20" />
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-accent"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{review.name}</h4>
                    <p className="text-xs text-muted-foreground">{review.company}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-highlight text-highlight" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm italic">"{review.review}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="bg-card section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Results</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Proven Results
              </h2>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {results.map((result, index) => (
              <motion.div
                key={result.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium p-6"
              >
                <div className="text-sm text-accent font-medium mb-2">{result.client}</div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {result.title}
                </h3>
                <p className="text-muted-foreground mb-4">{result.description}</p>
                <ul className="space-y-2">
                  {result.metrics.map((metric, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                      {metric}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
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
              Ready to Scale Your Marketing?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Let's create a data-driven marketing strategy that delivers real results.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-primary-foreground text-primary font-medium hover:scale-105 transition-transform"
            >
              Request a Strategy Call
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DigitalMarketing;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Code, Globe, Smartphone, Database, Cloud, Shield, ArrowRight, Star, Quote, Layout, Server, Layers, FileCode, Palette, Monitor } from "lucide-react";
import webDevImg from "@/assets/web-dev.jpg";
import ProjectCardStack from "@/components/ui/project-card-stack";

const services = [
  {
    icon: Globe,
    title: "Business Websites",
    description: "A professional website that makes visitors trust you — fast, mobile-friendly, and built to turn browsers into buyers.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Most people browse on their phones. We make sure your site looks and works perfectly on every screen size.",
  },
  {
    icon: Code,
    title: "Custom Applications",
    description: "Need something specific? We build custom tools that solve your exact business problems.",
  },
  {
    icon: Database,
    title: "Easy Content Updates",
    description: "Update your website yourself — no tech skills needed. We set you up with simple tools you'll actually use.",
  },
  {
    icon: Cloud,
    title: "Online Stores",
    description: "Sell products online with secure checkout. We handle the technical stuff so you can focus on selling.",
  },
  {
    icon: Shield,
    title: "Ongoing Support",
    description: "Websites need care. We keep yours secure, updated, and running smoothly so you don't have to worry.",
  },
];

const projectTypes = [
  {
    icon: Layout,
    title: "Frontend Development",
    description: "The part your customers see. We make it beautiful, fast, and easy to use.",
    features: ["Clean, Modern Design", "Smooth Animations", "Fast Loading", "Works on All Browsers"],
  },
  {
    icon: Server,
    title: "Backend Development",
    description: "The engine under the hood. We build systems that handle your data securely.",
    features: ["Secure Data Handling", "Custom Features", "User Accounts", "Payment Processing"],
  },
  {
    icon: Layers,
    title: "Complete Web Apps",
    description: "Full applications built from scratch — everything from login to checkout.",
    features: ["All-in-One Solutions", "Real-Time Updates", "Third-Party Connections", "Built to Scale"],
  },
  {
    icon: FileCode,
    title: "Landing Pages",
    description: "One-page sites designed with one goal: get visitors to take action.",
    features: ["High Conversion", "Lightning Fast", "SEO Ready", "Trackable Results"],
  },
  {
    icon: Palette,
    title: "Portfolio Sites",
    description: "Showcase your work professionally. Perfect for freelancers and creative agencies.",
    features: ["Stunning Galleries", "Easy Updates", "Contact Forms", "Social Integration"],
  },
  {
    icon: Monitor,
    title: "Corporate Websites",
    description: "Professional sites that build trust and credibility with potential clients.",
    features: ["Team Pages", "Service Showcases", "Case Studies", "Client Testimonials"],
  },
];

const technologies = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "Vue.js", category: "Frontend" },
  { name: "Angular", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "Django", category: "Backend" },
  { name: "Express.js", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "Redis", category: "Database" },
  { name: "AWS", category: "Cloud" },
  { name: "Docker", category: "DevOps" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "WordPress", category: "CMS" },
  { name: "Shopify", category: "E-Commerce" },
  { name: "Firebase", category: "Cloud" },
];

const projects = [
  {
    id: 1,
    title: "BrindaRani Divine Store",
    client: "BrindaRani",
    description: "E-commerce storefront for spiritual products and Vrindavan specials.",
    fullDescription:
      "BrindaRani needed a calm, premium shopping experience for puja items, idols, and spiritual gifts. We organized large catalogs into intuitive categories, added search-first navigation, and created a clean hero section that highlights seasonal collections.",
    image: "/web%20projects/brindarami.png",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
    results: [
      "Faster product discovery with category-first navigation",
      "Clear CTAs that guide visitors to featured collections",
      "Mobile-friendly layout for devotional shoppers",
      "Polished brand presentation with consistent visuals",
    ],
  },
  {
    id: 2,
    title: "My Drivemate",
    client: "DriveMate",
    description: "Ride-matching dashboard with quick actions and booking visibility.",
    fullDescription:
      "DriveMate required a user dashboard that makes booking rides feel effortless. We designed a clean action-first layout with ride search, trip history, and notifications so users can find their next ride in seconds.",
    image: "/web%20projects/drivemate.png",
    technologies: ["Next.js", "TypeScript", "Firebase", "Mapbox", "Tailwind CSS"],
    results: [
      "Quick actions front-and-center for faster booking",
      "Clear ride summaries and upcoming trip visibility",
      "Consistent UI for riders across devices",
      "Scalable dashboard structure for future features",
    ],
  },
  {
    id: 3,
    title: "EventFlow Premium Events",
    client: "EventFlow",
    description: "Premium events platform with dashboard and booking insights.",
    fullDescription:
      "EventFlow needed a dashboard that feels premium and organized for high-end event experiences. We built a clean interface with clear navigation, booking status cards, and a polished member experience.",
    image: "/web%20projects/eventflow.png",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Tailwind CSS"],
    results: [
      "Streamlined event discovery and booking flow",
      "Dashboard cards that summarize key activity",
      "Premium visual tone that matches the brand",
      "Layout optimized for clarity and confidence",
    ],
  },
  {
    id: 4,
    title: "MotoRentix",
    client: "MotoRentix",
    description: "High-impact landing page for premium sports bike rentals.",
    fullDescription:
      "MotoRentix needed a bold, high-conversion homepage for sports bike rentals. We delivered a cinematic hero, strong CTAs, and a clear path to explore vehicles or start booking.",
    image: "/web%20projects/Motorentix.png",
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS", "Vercel", "Google Maps"],
    results: [
      "Hero section built to drive immediate action",
      "Smooth navigation between homepage and dashboard",
      "Modern visuals that highlight premium bikes",
      "Clear user journey from browsing to booking",
    ],
  },
  {
    id: 5,
    title: "Shree Giriraj Sewa Sadan",
    client: "Shree Giriraj",
    description: "Hospitality website for a dharamshala with services and gallery.",
    fullDescription:
      "Shree Giriraj Sewa Sadan needed a respectful, welcoming site for guests. We focused on clarity, multilingual-friendly typography, and a calm layout that highlights services, gallery, and contact details.",
    image: "/web%20projects/shreegiriraj.png",
    technologies: ["React", "Tailwind CSS", "EmailJS", "Google Maps"],
    results: [
      "Clear service navigation for visitors and families",
      "Easy access to gallery and location details",
      "Simple contact flow for inquiries",
      "Trust-building layout suited for hospitality",
    ],
  },
];

const customerReviews = [
  {
    name: "Rajesh Sharma",
    company: "TechStart India",
    role: "CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    review: "Liklet transformed our entire digital presence. The new website increased our leads by 200% and the team was incredibly professional throughout the process. Highly recommended!",
  },
  {
    name: "Priya Patel",
    company: "Fashion Forward",
    role: "Marketing Director",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    review: "The e-commerce platform they built for us is phenomenal. Our online sales have tripled since launch. The attention to detail and user experience is outstanding.",
  },
  {
    name: "Amit Kumar",
    company: "GrowthHub",
    role: "Founder & CTO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    review: "Working with Liklet on our SaaS dashboard was a game-changer. They understood our complex requirements and delivered a product that exceeded our expectations.",
  },
  {
    name: "Dr. Sneha Reddy",
    company: "MediCare Plus",
    role: "Chief Medical Officer",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    review: "The healthcare portal has revolutionized how we interact with patients. It's secure, user-friendly, and has significantly improved our operational efficiency.",
  },
  {
    name: "Vikram Singh",
    company: "PropertyHub",
    role: "Co-Founder",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    review: "Liklet's technical expertise is unmatched. They built us a platform that handles millions of users without breaking a sweat. Best investment we've ever made.",
  },
  {
    name: "Ananya Gupta",
    company: "EduTech Pro",
    role: "Product Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    review: "From concept to launch, Liklet was with us every step of the way. Their communication is excellent and they always deliver on time. True professionals!",
  },
];

const stats = [
  { value: "150+", label: "Projects Completed" },
  { value: "50+", label: "Happy Clients" },
  { value: "4.9", label: "Average Rating" },
  { value: "99%", label: "Client Satisfaction" },
];

const WebDevelopment = () => {
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
                For Businesses That Want Results
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Websites That
                <span className="block text-highlight">Bring You Customers</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
                A pretty website is nice, but what you really need is a website that works — one that shows up on Google, loads fast on phones, and convinces visitors to contact you.
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
              <Link to="/it-services/contact" className="btn-accent">
                Start Your Project
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
                  src={webDevImg}
                  alt="Web development workspace"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Types */}
      <section className="bg-card section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">What We Build</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Types of Projects We Work On
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                From simple landing pages to complex enterprise applications, we handle it all.
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="card-premium p-6 group"
              >
                <motion.div 
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-highlight flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  style={{ boxShadow: "0 10px 30px -10px hsl(210 100% 45% / 0.4)" }}
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
                IT Services
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                Comprehensive web development solutions tailored to your business needs.
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
                whileHover={{ 
                  y: -10,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="card-premium p-6"
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
              >
                <motion.div 
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-highlight flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    boxShadow: "0 10px 30px -10px hsl(210 100% 45% / 0.4)",
                  }}
                >
                  <service.icon className="w-7 h-7 text-accent-foreground" />
                </motion.div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="bg-card section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Technologies</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Technologies We Master
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                We use the latest and most reliable technologies to build your projects.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.1,
                  y: -5,
                }}
                className="group relative"
              >
                <span 
                  className="px-6 py-3 rounded-full bg-background border border-border text-foreground font-medium hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 cursor-default inline-block"
                  style={{ boxShadow: "0 4px 15px -3px hsl(215 50% 23% / 0.1)" }}
                >
                  {tech.name}
                </span>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {tech.category}
                </span>
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
                What Our Clients Say
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                Don't just take our word for it - hear from our satisfied clients.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customerReviews.map((review, index) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium p-6 relative"
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-accent/20" />
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-accent"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{review.name}</h4>
                    <p className="text-sm text-muted-foreground">{review.role}, {review.company}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-highlight text-highlight" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{review.review}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects - 3D Stacked Cards */}
      <section className="bg-card section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Our Work</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Featured Projects
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                Click on a card to view project details, or cycle through our portfolio
              </p>
            </motion.div>
          </div>

          <ProjectCardStack projects={projects} />
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
              Ready to Build Your Website?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Let's discuss your project and create something amazing together.
            </p>
            <Link
              to="/it-services/contact"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-primary-foreground text-primary font-medium hover:scale-105 transition-transform"
            >
              Get a Free Quote
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default WebDevelopment;


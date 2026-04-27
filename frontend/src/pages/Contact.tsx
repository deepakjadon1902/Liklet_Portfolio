import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, MapPin, Clock, Send, Globe, Share2, BarChart3, ArrowRight, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LampContainer } from "@/components/ui/lamp-effect";
import webDevImg from "@/assets/web-dev.jpg";
import socialMediaImg from "@/assets/social-media.jpg";
import digitalMarketingImg from "@/assets/digital-marketing.jpg";
import youtubeImg from "@/assets/youtube.jpg";
import { apiFetch } from "@/lib/apiClient";

const contactInfo = [
  {
    icon: MapPin,
    title: "Our Office - USA",
    details: [
      "2020 Forestview Road, Apt#206",
      "Rockford, IL-61108",
    ],
  },
  {
    icon: MapPin,
    title: "Our Office - India",
    details: [
      "Uttar Pradesh ( +91 9634359003 )",
      "281121",
      "India",
    ],
  },
  {
    icon: Mail,
    title: "Email",
    details: [ "support@liklet.com"],
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Monday - Friday: 9AM - 6PM", "Saturday: 10AM - 4PM", "Sunday: Closed"],
  },
];

const services = [
  { 
    id: 1, 
    title: "IT Services", 
    description: "Websites that bring customers", 
    image: webDevImg, 
    link: "/it-services",
    icon: Globe
  },
  { 
    id: 2, 
    title: "Social Media", 
    description: "Content that converts followers", 
    image: socialMediaImg, 
    link: "/social-media-marketing",
    icon: Share2
  },
  { 
    id: 3, 
    title: "Digital Marketing", 
    description: "Ads that actually work", 
    image: digitalMarketingImg, 
    link: "/digital-marketing",
    icon: BarChart3
  },
  { 
    id: 4, 
    title: "Video Editing & Reviews", 
    description: "YouTube edits and tech reviews", 
    image: youtubeImg, 
    link: "/video-editing",
    icon: PlayCircle
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiFetch("/public/contact", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: "Website Contact",
          message: formData.message,
          pageTitle: "Contact Page",
          company: formData.company,
          address: formData.address,
        }),
      });
    } catch (err) {
      console.warn("[frontend] contact email failed", err);
    }

    // Construct WhatsApp message
    const whatsappNumber = "919634359003"; // Replace with your company WhatsApp number
    const whatsappMessage = `*New Contact Form Submission - Liklet*

*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
${formData.company ? `*Company:* ${formData.company}` : ""}
${formData.address ? `*Address:* ${formData.address}` : ""}

*Message:*
${formData.message}`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Open WhatsApp with the message
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');

    // Show success message
    setTimeout(() => {
      toast({
        title: "WhatsApp + Email",
        description: "Your message is emailed to our team and opened in WhatsApp (tap send).",
      });
      setFormData({ name: "", email: "", phone: "", company: "", address: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

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
            Let's Talk
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 bg-gradient-to-b from-primary-foreground to-primary-foreground/60 bg-clip-text text-transparent">
            Have a Question?
            <span className="block text-highlight mt-2">We're Here to Help</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Not sure what you need? That's okay. Tell us about your business and what you're trying to achieve — we'll help you figure out the best path forward. No pressure, just honest advice.
          </p>
        </motion.div>
      </LampContainer>

      {/* Services Cards */}
      <section className="bg-card section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">What We Do</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                What Are You Looking For?
              </h2>
            </motion.div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="card-premium overflow-hidden h-full flex flex-col">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                      <service.icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-1">
                      {service.description}
                    </p>
                    <Link
                      to={service.link}
                      className="inline-flex items-center gap-2 text-accent font-medium text-sm hover:gap-3 transition-all"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-gradient section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium">Get in Touch</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-8">
                Contact Information
              </h2>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-muted-foreground">{detail}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-8 aspect-video rounded-xl overflow-hidden bg-secondary">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.123456789012!2d77.6593!3d27.5650!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDMzJzU0LjAiTiA3N8KwMzknMzMuNSJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Liklet Office Location"
                />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="card-premium p-8">
                <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                  Send Us a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        placeholder="+91 123 456 7890"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        placeholder="Your address"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-accent w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="w-5 h-5" />
                        Send Message
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ or Additional Info */}
      <section className="bg-card section-padding">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Here's What Happens After You Reach Out
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                { step: "1", title: "Quick Reply", description: "We'll get back to you within 24 hours — usually much faster." },
                { step: "2", title: "Free Consultation", description: "A quick call to understand your business and goals. No sales pitch." },
                { step: "3", title: "Clear Proposal", description: "If we're a good fit, you'll get a clear plan with honest pricing." },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                    {item.step}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

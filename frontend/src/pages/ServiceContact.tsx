import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

type Props = {
  pageTitle: string;
  defaultSubject: string;
};

const whatsappNumber = "919634359003";

const subjectGroups = [
  {
    label: "IT Services",
    options: [
      "Frontend Development",
      "Backend Development",
      "Full-Stack Development",
      "Website Redesign",
      "Bug Fixing & Maintenance",
    ],
  },
  {
    label: "Social Media",
    options: [
      "Instagram",
      "Facebook",
      "YouTube",
      "Twitter/X",
      "LinkedIn",
      "TikTok",
      "Telegram",
      "WhatsApp Business",
    ],
  },
  {
    label: "Digital Marketing",
    options: ["SEO", "Google Ads", "Meta Ads", "Lead Generation", "Email Marketing"],
  },
  {
    label: "Video Editing",
    options: ["YouTube Editing", "Reels/Shorts", "Product Review Videos", "Thumbnail Design"],
  },
] as const;

const ServiceContact = ({ pageTitle, defaultSubject }: Props) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();

  const allSubjects = useMemo(
    () => subjectGroups.flatMap((g) => g.options),
    []
  );

  const subjectFromUrl = searchParams.get("subject") || "";
  const initialSubject = allSubjects.includes(subjectFromUrl)
    ? subjectFromUrl
    : allSubjects.includes(defaultSubject)
      ? defaultSubject
      : allSubjects[0] ?? "General";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: initialSubject,
    message: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const whatsappMessage = `*New Query - Liklet*

*Page:* ${pageTitle}
*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
*Subject:* ${formData.subject}

*Message:*
${formData.message}`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");

    setTimeout(() => {
      toast({
        title: "Message Ready in WhatsApp",
        description: "Please tap send in WhatsApp to submit your query.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: initialSubject,
        message: "",
      });
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="overflow-hidden">
      <section className="hero-gradient section-padding pt-32">
        <div className="container-max text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4"
          >
            Contact Us
          </motion.h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Tell us what you need and we’ll reply quickly on WhatsApp.
          </p>
        </div>
      </section>

      <section className="bg-card section-padding">
        <div className="container-max max-w-3xl">
          <div className="card-premium p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">
              {pageTitle} Query
            </h2>
            <p className="text-muted-foreground mb-6">
              Fill the form and click submit to open WhatsApp with your message.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Name</label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-accent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Phone</label>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-accent"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Subject</label>
                  <select
                    required
                    name="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, subject: e.target.value }))
                    }
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-accent"
                  >
                    {subjectGroups.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Message</label>
                <textarea
                  required
                  name="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, message: e.target.value }))
                  }
                  className="mt-2 w-full min-h-[140px] rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Write your query..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-accent w-full inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Opening WhatsApp..." : "Submit on WhatsApp"}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceContact;

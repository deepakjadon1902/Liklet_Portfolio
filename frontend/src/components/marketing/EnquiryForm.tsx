import CountryPhoneInput from "@/components/ui/country-phone-input";
import { withCallingCode } from "@/lib/countries";
import { FormEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/apiClient";

const subjectGroups = [
  {
    label: "IT services",
    options: [
      "Business Website",
      "Mobile Application",
      "CRM & Customer Management",
      "Online Store (E-commerce)",
      "Booking & Appointment System",
      "Custom Business Software",
      "Landing Page or Portfolio Website",
      "Website Redesign",
      "Website & App Support",
      "Help Me Choose",
    ],
  },
  {
    label: "Social media",
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
    label: "Digital marketing",
    options: [
      "SEO",
      "Google Ads",
      "Meta Ads",
      "Lead Generation",
      "Email Marketing",
      "Analytics & Reporting",
    ],
  },
  {
    label: "Video editing",
    options: [
      "YouTube Editing",
      "Reels/Shorts",
      "Product Review Videos",
      "Thumbnail Design",
      "Audio & Colour Editing",
      "Captions & Video Delivery",
    ],
  },
];
const allSubjects = subjectGroups.flatMap((group) => group.options);

export default function EnquiryForm({
  pageTitle,
  defaultSubject = "Help Me Choose",
  phoneRequired = false,
}: {
  pageTitle: string;
  defaultSubject?: string;
  phoneRequired?: boolean;
}) {
  const [searchParams] = useSearchParams();
  const requestedSubject = searchParams.get("subject") || defaultSubject;
  const initialSubject = allSubjects.includes(requestedSubject)
    ? requestedSubject
    : "Help Me Choose";
  const [form, setForm] = useState({
    name: "",
    email: "",
    countryId: "IN",
    phone: "",
    company: "",
    address: "",
    subject: initialSubject,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setWhatsappUrl("");
    const { countryId, ...details } = form;
    const phone = withCallingCode(countryId, details.phone);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8_000);
    try {
      await apiFetch("/public/contact", {
        method: "POST",
        signal: controller.signal,
        body: JSON.stringify({ ...details, phone, pageTitle }),
      });
    } catch {
      // WhatsApp remains available if the contact API is unavailable.
    } finally {
      window.clearTimeout(timeout);
    }
    const message = [
      "New enquiry - Liklet",
      "Name: " + details.name,
      "Email: " + details.email,
      phone && "Phone: " + phone,
      details.company && "Company: " + details.company,
      details.address && "Address: " + details.address,
      "Service: " + details.subject,
      details.message,
    ]
      .filter(Boolean)
      .join("\n");
    setWhatsappUrl("https://wa.me/919634359003?text=" + encodeURIComponent(message));
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-label="Project enquiry">
      <div>
        <label htmlFor="enquiry-name" className="text-sm font-medium">
          Your name <span className="text-muted-foreground">(required)</span>
        </label>
        <input
          id="enquiry-name"
          name="name"
          autoComplete="name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="form-field"
          placeholder="Your full name"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="enquiry-email" className="text-sm font-medium">
            Email <span className="text-muted-foreground">(required)</span>
          </label>
          <input
            id="enquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="form-field"
            placeholder="you@company.com"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="enquiry-phone" className="text-sm font-medium">
            Phone{" "}
            <span className="text-muted-foreground">
              {phoneRequired ? "(required)" : "(optional)"}
            </span>
          </label>
          <CountryPhoneInput
            id="enquiry-phone"
            countryId={form.countryId}
            value={form.phone}
            required={phoneRequired}
            onCountryChange={(countryId) => setForm((previous) => ({ ...previous, countryId }))}
            onChange={(phone) => setForm((previous) => ({ ...previous, phone }))}
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="enquiry-company" className="text-sm font-medium">
            Company name <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="enquiry-company"
            name="company"
            autoComplete="organization"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="form-field"
            placeholder="Your business or brand"
          />
        </div>
        <div>
          <label htmlFor="enquiry-address" className="text-sm font-medium">
            Address <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="enquiry-address"
            name="address"
            autoComplete="street-address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="form-field"
            placeholder="Your address"
          />
        </div>
      </div>
      <div>
        <label htmlFor="enquiry-subject" className="text-sm font-medium">
          What do you need?
        </label>
        <select
          id="enquiry-subject"
          name="subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="form-field"
        >
          {subjectGroups.map((group) => (
            <optgroup label={group.label} key={group.label}>
              {group.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="enquiry-message" className="text-sm font-medium">
          Tell us about your project <span className="text-muted-foreground">(required)</span>
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="form-field min-h-36 resize-y"
          placeholder={
            pageTitle === "IT Services"
              ? "For example: I need a CRM to track enquiries, or an app so customers can book our services."
              : "What does your business do, and what would you like help with?"
          }
        />
      </div>
      <p id="enquiry-delivery" className="text-xs leading-6 text-muted-foreground">
        We'll prepare your message for WhatsApp and also try to send it to our team by email. You'll
        need to tap Send in WhatsApp to finish.
      </p>
      <button
        type="submit"
        disabled={isSubmitting}
        aria-describedby="enquiry-delivery"
        className="btn-accent w-full"
      >
        {isSubmitting ? "Preparing your message..." : "Prepare enquiry"}
        <ArrowRight aria-hidden="true" className="ml-3 h-4 w-4" />
      </button>
      {whatsappUrl && (
        <div role="status" className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm font-medium">Your message is ready.</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Open WhatsApp, check your message, and tap Send to contact our team.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Continue on WhatsApp <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
          </a>
        </div>
      )}
    </form>
  );
}

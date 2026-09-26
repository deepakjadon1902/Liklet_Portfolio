import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const quickLinks = [
  ["Home", "/"],
  ["About", "/about"],
  ["IT Services", "/it-services"],
  ["Social Media", "/social-media-marketing"],
  ["Digital Marketing", "/digital-marketing"],
  ["Video Editing", "/video-editing"],
];

const legalLinks = [
  ["Terms of Service", "/terms-of-service"],
  ["Privacy Policy", "/privacy-policy"],
  ["Contact", "/contact"],
];

const socialLinks = [
  { name: "Facebook", icon: "https://cdn.simpleicons.org/facebook/1877F2" },
  { name: "X", icon: "https://cdn.simpleicons.org/x/111827" },
  { name: "Instagram", icon: "https://cdn.simpleicons.org/instagram/E4405F" },
  { name: "WhatsApp", icon: "https://cdn.simpleicons.org/whatsapp/25D366" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hero-gradient border-t border-white/10 text-white">
      <div className="container-max px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-[1.25fr_0.9fr_0.75fr_1fr] lg:gap-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-white shadow-sm">
                <img src="/images/logo.jpg" alt="Liklet Logo" className="h-full w-full object-cover" />
              </div>
              <span className="font-display text-2xl font-extrabold leading-none text-white">Liklet</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/72">
              Practical digital services for businesses that want cleaner websites, stronger content, and measurable growth.
            </p>
            <div className="mt-4 flex gap-2.5">
              {socialLinks.map((item) => (
                <a
                  href="#"
                  key={item.name}
                  aria-label={item.name}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/95 transition hover:bg-white"
                >
                  <img src={item.icon} alt="" className="h-4 w-4 object-contain" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">Quick Links</h3>
            <ul className="mt-3 grid gap-1.5">
              {quickLinks.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-white/72 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">Legal</h3>
            <ul className="mt-3 grid gap-1.5">
              {legalLinks.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-white/72 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">Contact</h3>
            <ul className="mt-3 grid gap-2.5">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/80" />
                <span className="text-sm leading-5 text-white/72">Vrindavan, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-white/80" />
                <a href="tel:+919634359003" className="text-sm text-white/72 transition-colors hover:text-white">
                  +91 9634359003
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-white/80" />
                <a
                  href="mailto:support@liklet.com"
                  className="text-sm text-white/72 transition-colors hover:text-white"
                >
                  support@liklet.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-white/12 pt-4">
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <p className="text-xs text-white/60">Copyright {currentYear} Liklet. All rights reserved.</p>
            <p className="text-xs text-white/60">Digital services designed for clarity and growth.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

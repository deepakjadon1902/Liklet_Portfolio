import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["IT Services", "/it-services"],
  ["Social Media Marketing", "/social-media-marketing"],
  ["Digital Marketing", "/digital-marketing"],
  ["Video Editing & Reviews", "/video-editing"],
];

const legalLinks = [
  ["Terms of Service", "/terms-of-service"],
  ["Privacy Policy", "/privacy-policy"],
  ["Contact Us", "/contact"],
];

const socialLinks = [
  { name: "Facebook", icon: "https://cdn.simpleicons.org/facebook/1877F2" },
  { name: "X", icon: "https://cdn.simpleicons.org/x/000000" },
  { name: "Instagram", icon: "https://cdn.simpleicons.org/instagram/E4405F" },
  { name: "WhatsApp", icon: "https://cdn.simpleicons.org/whatsapp/25D366" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#c5c5c5] bg-white text-black">
      <div className="container-max px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_0.85fr_1.1fr] lg:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#c5c5c5] bg-white shadow-sm">
                <img src="/images/logo.jpg" alt="Liklet Logo" className="h-full w-full object-cover" />
              </div>
              <span className="font-display text-3xl font-bold leading-none text-black">Liklet</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-black/70">
              Empowering businesses with innovative digital solutions. We transform ideas into impactful digital experiences.
            </p>
            <div className="mt-5 flex gap-3">
              {socialLinks.map((item) => (
                <a
                  href="#"
                  key={item.name}
                  aria-label={item.name}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c5c5c5] bg-white transition hover:border-[#4169E1] hover:shadow-sm"
                >
                  <img src={item.icon} alt="" className="h-[18px] w-[18px] object-contain" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold leading-none text-black">Quick Links</h3>
            <ul className="mt-4 grid gap-2">
              {quickLinks.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-black/70 transition-colors hover:text-accent">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold leading-none text-black">Legal</h3>
            <ul className="mt-4 grid gap-2">
              {legalLinks.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-black/70 transition-colors hover:text-accent">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold leading-none text-black">Contact Us</h3>
            <ul className="mt-4 grid gap-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-sm leading-6 text-black/70">Virndavan, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a href="tel:+911234567890" className="text-sm text-black/70 transition-colors hover:text-accent">
                  +91 9634359003
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a
                  href="mailto:support@liklet.com"
                  className="text-sm text-black/70 transition-colors hover:text-accent"
                >
                  support@liklet.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#c5c5c5] pt-5">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-xs text-black/60">© {currentYear} Liklet. All rights reserved.</p>
            <p className="text-xs text-black/60">Crafted with passion for digital excellence</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

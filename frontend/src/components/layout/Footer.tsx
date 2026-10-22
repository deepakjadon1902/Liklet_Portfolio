import { Link } from "react-router-dom";
import Brand from "@/components/brand/Brand";
import { serviceLinks } from "@/data/services";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[#101d2d] text-white">
      <div className="container-max px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.7fr_1fr]">
          <div>
            <Link to="/" aria-label="Liklet home" className="inline-block">
              <Brand />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-300">
              Websites, apps, content, and marketing. Practical help for the business you're
              building.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Services
            </h2>
            <ul className="mt-5 space-y-3">
              {serviceLinks.map((service) => (
                <li key={service.path}>
                  <Link to={service.path} className="text-sm text-slate-300 hover:text-white">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Company
            </h2>
            <ul className="mt-5 space-y-3">
              <li>
                <Link to="/about" className="text-sm text-slate-300 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-slate-300 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="text-sm text-slate-300 hover:text-white">
                  My orders
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Get in touch
            </h2>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <a href="mailto:support@liklet.com" className="block break-words hover:text-white">
                support@liklet.com
              </a>
              <a href="tel:+919634359003" className="block hover:text-white">
                +91 9634359003
              </a>
              <a
                href="https://wa.me/919634359003"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-b border-slate-500 pb-1 hover:text-white"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Liklet. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link to="/privacy-policy" className="hover:text-white">
              Privacy policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-white">
              Terms of service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

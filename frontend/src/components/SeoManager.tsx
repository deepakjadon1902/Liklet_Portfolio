import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://liklet.com";
const SITE_NAME = "Liklet";
const LOGO_URL = `${SITE_URL}/images/logo.jpg`;

type SeoConfig = {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
};

const seoByPath: Record<string, SeoConfig> = {
  "/": {
    title: "Liklet - Websites, SEO & Social Media Marketing for Growth",
    description:
      "Liklet helps startups and small businesses win more customers with conversion-focused websites, SEO, digital marketing, social media campaigns, and video editing.",
  },
  "/about": {
    title: "About Liklet - Practical Digital Growth Team",
    description:
      "Meet Liklet, a digital growth team helping small businesses compete online with practical strategy, honest execution, and measurable marketing results.",
  },
  "/contact": {
    title: "Contact Liklet - Book a Free Growth Consultation",
    description:
      "Contact Liklet to discuss web development, SEO, digital marketing, social media growth, video editing, or a custom online growth plan.",
  },
  "/it-services": {
    title: "IT Services & Web Development for Businesses - Liklet",
    description:
      "Build a fast, mobile-friendly website or web application with Liklet's IT services, frontend development, and conversion-focused design support.",
  },
  "/web-development": {
    title: "Web Development Services - Liklet",
    description:
      "Liklet builds business websites and web applications that load quickly, work on mobile, and turn visitors into real leads.",
    canonical: `${SITE_URL}/it-services`,
  },
  "/it-services/contact": {
    title: "Discuss an IT Services Project with Liklet",
    description:
      "Share your website, frontend development, or web application requirements with Liklet and get a practical project recommendation.",
  },
  "/social-media-marketing": {
    title: "Social Media Marketing Services for Brands - Liklet",
    description:
      "Grow your brand with Liklet's social media strategy, content planning, platform management, and campaigns built to convert attention into customers.",
  },
  "/social-media-marketing/contact": {
    title: "Start a Social Media Marketing Project - Liklet",
    description:
      "Contact Liklet for Instagram, YouTube, Facebook, LinkedIn, WhatsApp Business, Telegram, TikTok, and X marketing support.",
  },
  "/digital-marketing": {
    title: "Digital Marketing & SEO Services for Leads - Liklet",
    description:
      "Get SEO, paid ads, content strategy, analytics, and digital marketing campaigns from Liklet to attract qualified leads and grow revenue.",
  },
  "/digital-marketing/contact": {
    title: "Plan a Digital Marketing Campaign with Liklet",
    description:
      "Tell Liklet about your growth goals and get a digital marketing plan for SEO, ads, content, analytics, and campaign optimization.",
  },
  "/video-editing": {
    title: "Video Editing & YouTube Review Services - Liklet",
    description:
      "Create polished YouTube videos, product reviews, reels, shorts, and brand content with Liklet's video editing and review support.",
  },
  "/video-editing/contact": {
    title: "Request Video Editing Services from Liklet",
    description:
      "Contact Liklet for YouTube editing, tech review videos, reels, shorts, product content, and video support for your brand.",
  },
  "/terms-of-service": {
    title: "Terms of Service - Liklet",
    description: "Read the terms that apply when you use Liklet's web development, digital marketing, social media, and content services.",
  },
  "/privacy-policy": {
    title: "Privacy Policy - Liklet",
    description: "Learn how Liklet collects, uses, stores, and protects information when you visit the website, contact the team, or use services.",
  },
  "/auth": {
    title: "Client Sign In - Liklet",
    description: "Sign in to your Liklet client account to access service details and account features.",
    noindex: true,
  },
  "/my-orders": {
    title: "My Service Orders - Liklet",
    description: "View your Liklet service orders, package details, and project purchase history.",
    noindex: true,
  },
  "/profile": {
    title: "Client Profile - Liklet",
    description: "Manage your Liklet client profile, contact information, and account preferences.",
    noindex: true,
  },
};

const serviceSeoBySlug: Record<string, SeoConfig> = {
  youtube: {
    title: "YouTube Marketing Packages for Channel Growth - Liklet",
    description: "Choose Liklet YouTube marketing packages for views, subscribers, likes, comments, shares, and stronger channel growth.",
  },
  facebook: {
    title: "Facebook Marketing Packages for Business Pages - Liklet",
    description: "Explore Liklet Facebook marketing packages for page likes, post engagement, followers, shares, comments, and community growth.",
  },
  instagram: {
    title: "Instagram Marketing Packages for Reels & Growth - Liklet",
    description: "Grow your Instagram presence with Liklet packages for followers, likes, comments, Reels views, Story views, and brand engagement.",
  },
  "twitter-x": {
    title: "X Marketing Packages for Reach & Engagement - Liklet",
    description: "Build a stronger presence on X with Liklet packages for followers, likes, reposts, impressions, replies, and audience growth.",
  },
  linkedin: {
    title: "LinkedIn Marketing Packages for B2B Growth - Liklet",
    description: "Use Liklet LinkedIn marketing packages to grow connections, followers, profile views, post engagement, and professional authority.",
  },
  tiktok: {
    title: "TikTok Marketing Packages for Short-Form Growth - Liklet",
    description: "Create TikTok momentum with Liklet packages for followers, views, likes, comments, shares, and short-form content growth.",
  },
  telegram: {
    title: "Telegram Marketing Packages for Channel Growth - Liklet",
    description: "Build Telegram channel growth with Liklet packages for members, views, post reach, engagement, and loyal subscribers.",
  },
  "whatsapp-business": {
    title: "WhatsApp Business Marketing Packages - Liklet",
    description: "Use Liklet WhatsApp Business packages to improve broadcasts, customer engagement, response rate, catalog views, and conversions.",
  },
};

const adminSeoByPath: Record<string, SeoConfig> = {
  "/admin": {
    title: "Admin Redirect - Liklet",
    description: "Liklet admin redirect page for internal team access.",
    noindex: true,
  },
  "/admin/login": {
    title: "Admin Login - Liklet",
    description: "Secure Liklet admin login for managing services, packages, orders, payments, and users.",
    noindex: true,
  },
  "/admin/dashboard": {
    title: "Admin Dashboard - Liklet",
    description: "Internal Liklet dashboard for reviewing users, services, orders, and payment activity.",
    noindex: true,
  },
  "/admin/services": {
    title: "Manage Services - Liklet Admin",
    description: "Internal Liklet service catalog management page for editing public service details.",
    noindex: true,
  },
  "/admin/packages": {
    title: "Manage Packages - Liklet Admin",
    description: "Internal Liklet package management page for editing pricing, plans, and package features.",
    noindex: true,
  },
  "/admin/orders": {
    title: "Manage Orders - Liklet Admin",
    description: "Internal Liklet order management page for reviewing client purchases and service requests.",
    noindex: true,
  },
  "/admin/payments": {
    title: "Manage Payments - Liklet Admin",
    description: "Internal Liklet payment management page for reviewing payment records and transactions.",
    noindex: true,
  },
  "/admin/users": {
    title: "Manage Users - Liklet Admin",
    description: "Internal Liklet user management page for reviewing client account records.",
    noindex: true,
  },
};

function upsertMeta(selector: string, create: () => HTMLMetaElement, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = create();
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function getSeoConfig(pathname: string): SeoConfig {
  if (pathname.startsWith("/admin")) {
    return (
      adminSeoByPath[pathname] || {
        title: "Admin Area - Liklet",
        description: "Internal Liklet admin page for authorized team members only.",
        noindex: true,
      }
    );
  }

  if (pathname.startsWith("/checkout/")) {
    return {
      title: "Secure Checkout - Liklet",
      description: "Complete your Liklet service package checkout securely.",
      noindex: true,
    };
  }

  if (pathname.startsWith("/services/")) {
    const slug = pathname.replace("/services/", "").split("/")[0];
    return (
      serviceSeoBySlug[slug] || {
        title: "Service Packages - Liklet",
        description: "Explore Liklet service packages for social media marketing and business growth.",
        noindex: true,
      }
    );
  }

  return (
    seoByPath[pathname] || {
      title: "Page Not Found - Liklet",
      description: "The page you requested could not be found on Liklet.",
      noindex: true,
    }
  );
}

export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSeoConfig(pathname);
    const canonicalUrl = seo.canonical || `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
    const robots = seo.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large";

    document.title = seo.title;

    upsertMeta('meta[name="description"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      return meta;
    }, seo.description);

    upsertMeta('meta[name="robots"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      return meta;
    }, robots);

    upsertMeta('meta[property="og:title"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:title");
      return meta;
    }, seo.title);

    upsertMeta('meta[property="og:description"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:description");
      return meta;
    }, seo.description);

    upsertMeta('meta[property="og:url"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:url");
      return meta;
    }, canonicalUrl);

    upsertMeta('meta[property="og:image"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:image");
      return meta;
    }, LOGO_URL);

    upsertMeta('meta[name="twitter:title"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "twitter:title");
      return meta;
    }, seo.title);

    upsertMeta('meta[name="twitter:description"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "twitter:description");
      return meta;
    }, seo.description);

    upsertMeta('meta[name="twitter:image"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "twitter:image");
      return meta;
    }, LOGO_URL);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
  }, [pathname]);

  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    };

    let script = document.getElementById("website-structured-data") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "website-structured-data";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, []);

  return null;
}

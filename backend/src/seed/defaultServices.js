const { Service } = require("../models/Service");
const { Package } = require("../models/Package");

const SOCIAL_MEDIA_DEFAULTS = [
  {
    slug: "youtube",
    name: "YouTube",
    tagline: "Boost your channel, rule the stream!",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
    features: ["Views", "Subscribers", "Likes", "Comments", "Shares"],
  },
  {
    slug: "facebook",
    name: "Facebook",
    tagline: "Connect, engage, and grow your community!",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg",
    features: ["Page Likes", "Post Engagement", "Followers", "Shares", "Comments"],
  },
  {
    slug: "instagram",
    name: "Instagram",
    tagline: "Picture perfect growth, every post!",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg",
    features: ["Followers", "Likes", "Comments", "Reels Views", "Story Views"],
  },
  {
    slug: "twitter-x",
    name: "Twitter/X",
    tagline: "Tweet smarter, trend faster!",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cc/X_icon.svg",
    features: ["Followers", "Likes", "Retweets", "Impressions", "Replies"],
  },
  {
    slug: "linkedin",
    name: "LinkedIn",
    tagline: "Build authority, unlock opportunities!",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
    features: ["Connections", "Post Engagement", "Followers", "Profile Views", "Shares"],
  },
  {
    slug: "tiktok",
    name: "TikTok",
    tagline: "Go viral, capture the moment!",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Tiktok_icon.svg",
    features: ["Followers", "Views", "Likes", "Comments", "Shares"],
  },
  {
    slug: "telegram",
    name: "Telegram",
    tagline: "Secure reach, loyal subscribers!",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",
    features: ["Members", "Views", "Post Reach", "Engagement", "Channel Growth"],
  },
  {
    slug: "whatsapp-business",
    name: "WhatsApp Business",
    tagline: "Direct connections, instant results!",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    features: ["Broadcast Lists", "Customer Engagement", "Response Rate", "Business Profile", "Catalog Views"],
  },
];

const DEFAULT_PACKAGES = [
  {
    name: "Basic",
    priceInr: 4999,
    interval: "mo",
    description: "Starter plan for consistent growth.",
    features: ["Setup & optimization", "Monthly content plan", "Basic reporting", "Community support"],
  },
  {
    name: "Premium",
    priceInr: 9999,
    interval: "mo",
    description: "Growth plan for faster results.",
    features: ["Advanced strategy", "Content + creatives", "Weekly reporting", "Priority support"],
    isPopular: true,
  },
  {
    name: "Elite",
    priceInr: 19999,
    interval: "mo",
    description: "Full-scale plan for aggressive growth.",
    features: ["Dedicated manager", "Daily optimization", "Ad guidance", "Performance reporting"],
  },
];

async function ensureDefaultSocialMediaServices() {
  const existing = await Service.find({ type: "social-media" }).select({ slug: 1 }).lean();
  const existingSlugs = new Set(existing.map((s) => s.slug));

  for (const svc of SOCIAL_MEDIA_DEFAULTS) {
    let service = await Service.findOne({ slug: svc.slug }).lean();
    if (!service) {
      service = await Service.create({
        type: "social-media",
        slug: svc.slug,
        name: svc.name,
        tagline: svc.tagline,
        logoUrl: svc.logoUrl,
        features: svc.features,
        isActive: true,
      });
      existingSlugs.add(svc.slug);
    } else if (!existingSlugs.has(svc.slug)) {
      await Service.updateOne(
        { _id: service._id },
        { $set: { type: "social-media" } }
      );
      existingSlugs.add(svc.slug);
    }

    const serviceId = service._id;
    const pkgs = await Package.find({ serviceId }).select({ name: 1 }).lean();
    const pkgNames = new Set(pkgs.map((p) => p.name.toLowerCase()));

    for (const pkg of DEFAULT_PACKAGES) {
      if (pkgNames.has(pkg.name.toLowerCase())) continue;
      await Package.create({
        serviceId,
        name: pkg.name,
        priceInr: pkg.priceInr,
        interval: pkg.interval,
        description: pkg.description,
        features: pkg.features,
        isPopular: Boolean(pkg.isPopular),
        isActive: true,
      });
    }
  }
}

module.exports = { ensureDefaultSocialMediaServices };


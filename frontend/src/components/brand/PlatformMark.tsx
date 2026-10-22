import {
  SiFacebook,
  SiInstagram,
  SiTelegram,
  SiTiktok,
  SiWhatsapp,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { cn } from "@/lib/utils";

// Standard brand marks from Simple Icons and Font Awesome through react-icons.
const marks = {
  youtube: { icon: SiYoutube, color: "#FF0000" },
  facebook: { icon: SiFacebook, color: "#0866FF" },
  instagram: { icon: SiInstagram, color: "#C13584" },
  "twitter-x": { icon: SiX, color: "#111111" },
  linkedin: { icon: FaLinkedin, color: "#0A66C2" },
  tiktok: { icon: SiTiktok, color: "#111111" },
  telegram: { icon: SiTelegram, color: "#26A5E4" },
  "whatsapp-business": { icon: SiWhatsapp, color: "#128C7E" },
};

export default function PlatformMark({ slug, className }: { slug: string; className?: string }) {
  const mark = marks[slug as keyof typeof marks];
  if (!mark) return null;
  const Icon = mark.icon;
  return (
    <Icon
      aria-hidden="true"
      focusable="false"
      className={cn("h-6 w-6 shrink-0", className)}
      style={{ color: mark.color }}
    />
  );
}

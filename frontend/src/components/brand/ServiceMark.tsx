import { SiReact } from "react-icons/si";
import PlatformMark from "@/components/brand/PlatformMark";
import { cn } from "@/lib/utils";

export default function ServiceMark({ path, className }: { path: string; className?: string }) {
  const markClass = cn("h-6 w-6 shrink-0", className);

  if (path === "/it-services") {
    return <SiReact aria-hidden="true" focusable="false" className={markClass} color="#61DAFB" />;
  }

  if (path === "/digital-marketing") {
    return (
      <img
        src="/brand/google-g.png"
        width={24}
        height={24}
        alt=""
        className={cn(markClass, "object-contain")}
      />
    );
  }

  if (path === "/social-media-marketing") {
    return <PlatformMark slug="instagram" className={markClass} />;
  }

  if (path === "/video-editing") {
    return <PlatformMark slug="youtube" className={markClass} />;
  }

  return null;
}

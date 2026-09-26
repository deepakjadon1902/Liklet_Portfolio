import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogIn,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { FaGoogle, FaInstagram, FaReact, FaYoutube } from "react-icons/fa";
import { IconType } from "react-icons";
import { USER_AUTH_EVENT, clearUserToken, getUserToken } from "@/lib/userAuth";
import StaggeredDropDown from "@/components/ui/animated-staggered-dropdown";
import { cn } from "@/lib/utils";

const serviceLinks: Array<{ name: string; path: string; icon: IconType; iconClassName: string }> = [
  { name: "IT Services", path: "/it-services", icon: FaReact, iconClassName: "text-sky-500" },
  { name: "Social Media", path: "/social-media-marketing", icon: FaInstagram, iconClassName: "text-pink-600" },
  { name: "Digital Marketing", path: "/digital-marketing", icon: FaGoogle, iconClassName: "text-blue-600" },
  { name: "Video Editing", path: "/video-editing", icon: FaYoutube, iconClassName: "text-red-600" },
];

const navLinks = [
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getUserToken()));
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;
  const isServiceActive = serviceLinks.some((link) => isActive(link.path));
  const serviceOptions = serviceLinks.map((service) => ({
    text: service.name,
    Icon: service.icon,
    onSelect: () => navigate(service.path),
    iconClassName: service.iconClassName,
  }));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sync = () => setIsLoggedIn(Boolean(getUserToken()));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(USER_AUTH_EVENT, sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(USER_AUTH_EVENT, sync as EventListener);
    };
  }, [location.pathname]);

  const closeMenu = () => setIsOpen(false);

  const onLogout = () => {
    clearUserToken();
    closeMenu();
    navigate("/", { replace: false });
  };

  const authHref = `/auth?redirect=${encodeURIComponent(location.pathname || "/")}`;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent bg-transparent transition-all duration-300",
        scrolled && "shadow-none",
      )}
    >
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-5">
          <Link to="/" className="flex min-w-0 items-center gap-3" onClick={closeMenu}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white shadow-sm">
              <img src="/images/logo.jpg" alt="Liklet Logo" className="h-full w-full object-cover" />
            </span>
            <span className="font-display text-2xl font-extrabold tracking-normal text-black">Liklet</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-extrabold text-black transition hover:bg-white/55",
                  isActive(link.path) && "bg-white/55 text-black",
                )}
              >
                {link.name}
              </Link>
            ))}
            <StaggeredDropDown
              label="Services"
              options={serviceOptions}
              buttonClassName={cn(isServiceActive && "bg-white/55 text-black")}
              menuClassName="top-[135%]"
            />
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-extrabold text-black transition hover:bg-white/55",
                    isActive("/profile") && "bg-white/55 text-black",
                  )}
                >
                  <UserRound className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-extrabold text-black transition hover:bg-white/55"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link to={authHref} className="btn-accent py-2.5">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-black/10 bg-white/55 text-black shadow-sm backdrop-blur-md lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="border-t border-border bg-white lg:hidden">
          <div className="container-max px-4 py-4 sm:px-6">
            <div className="grid gap-1">
              {[...navLinks, ...serviceLinks].map((link) => {
                const Icon = "icon" in link ? link.icon : null;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMenu}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-extrabold text-black transition hover:bg-muted",
                      isActive(link.path) && "bg-muted text-black",
                    )}
                  >
                    {Icon ? (
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-black shadow-sm">
                        <Icon className={cn("h-4 w-4", "iconClassName" in link ? link.iconClassName : "")} />
                      </span>
                    ) : null}
                    {link.name}
                  </Link>
                );
              })}
              <div className="my-2 h-px bg-border" />
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-extrabold text-black hover:bg-muted"
                  >
                    <UserRound className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-extrabold text-black hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link to={authHref} onClick={closeMenu} className="btn-accent mt-1 w-full py-2.5">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;

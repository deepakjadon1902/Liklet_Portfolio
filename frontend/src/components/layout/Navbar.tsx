import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { USER_AUTH_EVENT, clearUserToken, getUserToken } from "@/lib/userAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Brand from "@/components/brand/Brand";
import ServiceMark from "@/components/brand/ServiceMark";
import { serviceLinks } from "@/data/services";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getUserToken()));
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const active = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const sync = () => setIsLoggedIn(Boolean(getUserToken()));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(USER_AUTH_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(USER_AUTH_EVENT, sync);
    };
  }, []);

  const logout = () => {
    clearUserToken();
    setIsOpen(false);
    navigate("/");
  };
  const authHref = "/auth?redirect=" + encodeURIComponent(location.pathname + location.search);
  const navClass =
    "rounded-md px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5 hover:text-black";

  return (
    <header
      className={cn(
        "top-0 z-50 text-black",
        isHome ? "fixed inset-x-0 bg-transparent" : "sticky border-b border-border bg-white",
      )}
    >
      <div className="container-max flex h-20 items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="Liklet home" className="shrink-0 text-black">
          <Brand />
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-2 lg:flex">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                navClass,
                "inline-flex items-center gap-2",
                serviceLinks.some((s) => active(s.path)) && "bg-black/5",
              )}
            >
              Services <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={14}
              className="w-[360px] max-w-[calc(100vw-2rem)] bg-white p-2 text-black"
            >
              {serviceLinks.map((service) => (
                <DropdownMenuItem key={service.path} asChild>
                  <Link
                    to={service.path}
                    aria-current={active(service.path) ? "page" : undefined}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left text-black focus:bg-black/5 focus:text-black"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white">
                      <ServiceMark path={service.path} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-black">
                        {service.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-black">
                        {service.description}
                      </span>
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            to="/about"
            aria-current={active("/about") ? "page" : undefined}
            className={cn(navClass, active("/about") && "bg-black/5")}
          >
            About
          </Link>
          <Link
            to="/contact"
            aria-current={active("/contact") ? "page" : undefined}
            className={cn(navClass, active("/contact") && "bg-black/5")}
          >
            Contact
          </Link>
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          {isLoggedIn ? (
            <>
              <Link to="/profile" className={navClass}>
                My account
              </Link>
              <button type="button" onClick={logout} className={navClass}>
                Sign out
              </button>
            </>
          ) : (
            <Link to={authHref} className={navClass}>
              Sign in
            </Link>
          )}
          <Link
            to="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-black/25 bg-transparent px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black/5"
          >
            Let's talk
          </Link>
        </div>
        <button
          type="button"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-black/25 bg-transparent text-black lg:hidden"
        >
          {isOpen ? (
            <X aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Menu aria-hidden="true" className="h-5 w-5" />
          )}
        </button>
      </div>
      {isOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border bg-white px-4 py-5 text-black lg:hidden"
        >
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-black">
            Services
          </p>
          {serviceLinks.map((service) => (
            <Link
              key={service.path}
              to={service.path}
              aria-current={active(service.path) ? "page" : undefined}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-black hover:bg-black/5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white">
                <ServiceMark path={service.path} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-black">{service.title}</span>
                <span className="mt-1 block text-xs leading-5 text-black">
                  {service.description}
                </span>
              </span>
            </Link>
          ))}
          <div className="my-3 border-t border-border" />
          <Link to="/about" className="block rounded-lg px-3 py-3 text-sm">
            About
          </Link>
          <Link to="/contact" className="block rounded-lg px-3 py-3 text-sm">
            Contact
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="block rounded-lg px-3 py-3 text-sm">
                My account
              </Link>
              <button
                onClick={logout}
                type="button"
                className="block w-full rounded-lg px-3 py-3 text-left text-sm"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to={authHref} className="block rounded-lg px-3 py-3 text-sm">
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Sparkles, UserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { USER_AUTH_EVENT, clearUserToken, getUserToken } from "@/lib/userAuth";

const serviceNavMeta: Record<
  string,
  { logoUrl: string; label: string }
> = {
  "/it-services": {
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    label: "IT",
  },
  "/social-media-marketing": {
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg",
    label: "SM",
  },
  "/digital-marketing": {
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Google_Ads_logo.svg",
    label: "DM",
  },
  "/video-editing": {
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
    label: "VE",
  },
};

const navLinks = [
  { name: "Home", path: "/" },
  {
    name: "Services",
    children: [
      { name: "IT Services", path: "/it-services" },
      { name: "Social Media Marketing", path: "/social-media-marketing" },
      { name: "Digital Marketing", path: "/digital-marketing" },
      { name: "Video Editing & Reviews", path: "/video-editing" },
    ],
  },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getUserToken()));

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
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

  const onLogout = () => {
    clearUserToken();
    setIsOpen(false);
    navigate("/", { replace: false });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-primary/95 backdrop-blur-xl shadow-lg border-b border-white/15"
          : "bg-primary/95 backdrop-blur-xl"
      }`}
      style={{
        perspective: "1000px",
      }}
    >
      {/* Animated gradient line at top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"
        animate={{
          opacity: scrolled ? 1 : 0,
          scaleX: scrolled ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="container-max section-padding !py-0">
        <div className="flex items-center justify-between h-20">
          {/* 3D Animated Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <motion.div
              whileHover={{ 
                rotateY: 360,
                scale: 1.1,
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg overflow-hidden"
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 10px 30px -10px hsl(225 73% 57% / 0.5)",
              }}
            >
              <img 
                src="/images/logo.jpg" 
                alt="Liklet Logo" 
                className="w-12 h-12 object-cover rounded-full z-10"
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-white animate-pulse z-20" />
            </motion.div>
            <motion.span
              className="font-display text-3xl font-bold text-white transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              Liklet
            </motion.span>
          </Link>

          {/* Desktop Navigation with 3D Effect */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link, index) =>
              link.children ? (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={`relative px-4 py-2 rounded-xl font-medium flex items-center gap-1 transition-all duration-300 ${
                      scrolled
                        ? "text-white hover:text-white hover:bg-white/10"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {link.name}
                    <motion.span
                      animate={{ rotate: servicesOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </motion.button>
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, rotateX: -15 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, y: 10, rotateX: -15 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-white rounded-2xl shadow-2xl overflow-hidden"
                        style={{
                          transformStyle: "preserve-3d",
                          boxShadow: "0 25px 50px -12px hsl(215 50% 23% / 0.25)",
                        }}
                      >
                        {link.children.map((child, childIndex) => {
                          const meta = serviceNavMeta[child.path];
                          return (
                            <motion.div
                              key={child.path}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: childIndex * 0.05 }}
                            >
                              <Link
                                to={child.path}
                                className={`flex items-center gap-3 px-5 py-4 text-black hover:bg-gradient-to-r hover:from-accent/10 hover:to-transparent transition-all duration-300 group ${
                                  isActive(child.path) ? "bg-accent/10 text-accent" : ""
                                }`}
                              >
                                <motion.div
                                  whileHover={{ scale: 1.12, rotate: 8 }}
                                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c5c5c5] bg-white p-2 shadow-sm"
                                >
                                  <img
                                    src={meta?.logoUrl}
                                    alt={`${child.name} logo`}
                                    className="h-full w-full object-contain"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                      const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                                      if (fallback) fallback.style.display = "block";
                                    }}
                                  />
                                  <span className="hidden text-xs font-bold text-[#4169E1]">
                                    {meta?.label || child.name.charAt(0)}
                                  </span>
                                </motion.div>
                                <span className="font-medium group-hover:translate-x-1 transition-transform">
                                  {child.name}
                                </span>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className="relative group"
                  >
                    <motion.span
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={`relative px-4 py-2 rounded-xl font-medium inline-block transition-all duration-300 ${
                        isActive(link.path)
                          ? scrolled
                            ? "text-white bg-white/15"
                            : "text-white bg-white/15"
                          : scrolled
                          ? "text-white hover:text-white hover:bg-white/10"
                          : "text-white hover:text-white hover:bg-white/10"
                      }`}
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {link.name}
                      {/* 3D floating underline */}
                      <motion.span
                        className="absolute -bottom-0.5 left-1/2 h-0.5 bg-white rounded-full"
                        initial={{ width: 0, x: "-50%" }}
                        animate={{
                          width: isActive(link.path) ? "60%" : 0,
                        }}
                        whileHover={{ width: "60%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.span>
                  </Link>
                </motion.div>
              )
            )}

            {isLoggedIn ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  <Link
                    to="/profile"
                    className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all duration-300 ${
                      isActive("/profile") ? "bg-white/15 text-white" : "text-white hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <UserRound className="h-4 w-4" />
                    Profile
                  </Link>
                </motion.div>
                <motion.button
                  type="button"
                  onClick={onLogout}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (navLinks.length + 1) * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    scrolled
                      ? "text-white hover:text-white hover:bg-white/10"
                      : "text-white hover:text-white hover:bg-white/10"
                  }`}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                <Link
                  to={`/auth?redirect=${encodeURIComponent(location.pathname || "/")}`}
                  className={`relative px-4 py-2 rounded-xl font-medium inline-block transition-all duration-300 ${
                    scrolled
                      ? "text-white hover:text-white hover:bg-white/10"
                      : "text-white hover:text-white hover:bg-white/10"
                  }`}
                >
                  Login
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button with 3D effect */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95, rotateZ: 90 }}
            className={`lg:hidden p-3 rounded-xl transition-all duration-300 ${
              scrolled
                ? "bg-white/10 hover:bg-white/20"
                : "bg-primary-foreground/10 hover:bg-primary-foreground/20"
            }`}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu with 3D Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, rotateX: -15 }}
            animate={{ opacity: 1, height: "auto", rotateX: 0 }}
            exit={{ opacity: 0, height: 0, rotateX: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="lg:hidden bg-primary/95 backdrop-blur-xl border-t border-white/15 overflow-hidden text-white"
            style={{
              transformStyle: "preserve-3d",
              boxShadow: "0 25px 50px -12px hsl(215 50% 23% / 0.25)",
            }}
          >
            <div className="container-max py-6 space-y-2">
              {navLinks.map((link, index) =>
                link.children ? (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-1"
                  >
                    <div className="px-4 py-2 font-medium text-white/70 text-sm uppercase tracking-wider">
                      {link.name}
                    </div>
                    {link.children.map((child, childIndex) => {
                      const meta = serviceNavMeta[child.path];
                      return (
                        <motion.div
                          key={child.path}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index + childIndex) * 0.05 }}
                        >
                          <Link
                            to={child.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                              isActive(child.path) ? "bg-white/15 text-white" : "text-white hover:bg-white/10"
                            }`}
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/25 bg-white p-2 shadow-sm">
                              <img
                                src={meta?.logoUrl}
                                alt={`${child.name} logo`}
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                                  if (fallback) fallback.style.display = "block";
                                }}
                              />
                              <span className="hidden text-xs font-bold text-[#4169E1]">
                                {meta?.label || child.name.charAt(0)}
                              </span>
                            </div>
                            {child.name}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isActive(link.path)
                          ? "bg-white/15 text-white"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {link.name.charAt(0)}
                        </span>
                      </div>
                      {link.name}
                    </Link>
                  </motion.div>
                )
              )}

              <div className="pt-2 border-t border-border/60" />
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white transition-all duration-300 ${
                      isActive("/profile") ? "bg-white/15" : "hover:bg-white/10"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <UserRound className="h-4 w-4 text-white" />
                    </div>
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:bg-white/10"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">L</span>
                    </div>
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to={`/auth?redirect=${encodeURIComponent(location.pathname || "/")}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:bg-white/10"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">L</span>
                  </div>
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

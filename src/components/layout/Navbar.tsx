import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", path: "/" },
  {
    name: "Services",
    children: [
      { name: "Web Development", path: "/web-development" },
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

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-card/95 backdrop-blur-xl shadow-lg border-b border-border/50"
          : "bg-primary/95 backdrop-blur-xl"
      }`}
      style={{
        perspective: "1000px",
      }}
    >
      {/* Animated gradient line at top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"
        animate={{
          opacity: scrolled ? 1 : 0,
          scaleX: scrolled ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="container-max section-padding !py-0">
        <div className="flex items-center justify-between h-20">
          {/* 3D Animated Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ 
                rotateY: 360,
                scale: 1.1,
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative w-12 h-12 rounded-full bg-gradient-to-br from-accent via-highlight to-accent flex items-center justify-center shadow-lg overflow-hidden"
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 10px 30px -10px hsl(210 100% 45% / 0.5)",
              }}
            >
              <img 
                src="/images/logo.jpg" 
                alt="Liklet Logo" 
                className="w-10 h-10 object-cover rounded-full z-10"
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-highlight/50 to-transparent"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-highlight animate-pulse z-20" />
            </motion.div>
            <motion.span
              className={`font-display text-2xl font-bold transition-colors duration-300 ${
                scrolled ? "text-primary" : "text-primary-foreground"
              }`}
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
                        ? "text-foreground hover:text-accent hover:bg-secondary"
                        : "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
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
                        className="absolute top-full left-0 mt-2 w-64 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden"
                        style={{
                          transformStyle: "preserve-3d",
                          boxShadow: "0 25px 50px -12px hsl(215 50% 23% / 0.25)",
                        }}
                      >
                        {link.children.map((child, childIndex) => (
                          <motion.div
                            key={child.path}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: childIndex * 0.05 }}
                          >
                            <Link
                              to={child.path}
                              className={`flex items-center gap-3 px-5 py-4 hover:bg-gradient-to-r hover:from-accent/10 hover:to-transparent transition-all duration-300 group ${
                                isActive(child.path) ? "bg-accent/10 text-accent" : ""
                              }`}
                            >
                              <motion.div
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center"
                              >
                                <span className="text-accent text-sm font-bold">
                                  {child.name.charAt(0)}
                                </span>
                              </motion.div>
                              <span className="font-medium group-hover:translate-x-1 transition-transform">
                                {child.name}
                              </span>
                            </Link>
                          </motion.div>
                        ))}
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
                            ? "text-accent bg-accent/10"
                            : "text-highlight bg-primary-foreground/10"
                          : scrolled
                          ? "text-foreground hover:text-accent hover:bg-secondary"
                          : "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
                      }`}
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {link.name}
                      {/* 3D floating underline */}
                      <motion.span
                        className="absolute -bottom-0.5 left-1/2 h-0.5 bg-gradient-to-r from-accent to-highlight rounded-full"
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
          </div>

          {/* Mobile Menu Button with 3D effect */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95, rotateZ: 90 }}
            className={`lg:hidden p-3 rounded-xl transition-all duration-300 ${
              scrolled
                ? "bg-secondary hover:bg-accent/10"
                : "bg-primary-foreground/10 hover:bg-primary-foreground/20"
            }`}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <X className={`w-6 h-6 ${scrolled ? "text-foreground" : "text-primary-foreground"}`} />
              ) : (
                <Menu className={`w-6 h-6 ${scrolled ? "text-foreground" : "text-primary-foreground"}`} />
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
            className="lg:hidden bg-card/95 backdrop-blur-xl border-t border-border overflow-hidden"
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
                    <div className="px-4 py-2 font-medium text-muted-foreground text-sm uppercase tracking-wider">
                      {link.name}
                    </div>
                    {link.children.map((child, childIndex) => (
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
                            isActive(child.path)
                              ? "bg-accent/10 text-accent"
                              : "hover:bg-secondary"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                            <span className="text-accent text-sm font-bold">
                              {child.name.charAt(0)}
                            </span>
                          </div>
                          {child.name}
                        </Link>
                      </motion.div>
                    ))}
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
                          ? "bg-accent/10 text-accent"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <span className="text-accent text-sm font-bold">
                          {link.name.charAt(0)}
                        </span>
                      </div>
                      {link.name}
                    </Link>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

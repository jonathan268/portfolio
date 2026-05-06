import { Terminal } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { id: "hero",     label: "Accueil" },
  { id: "about",    label: "À propos" },
  { id: "skills",   label: "Stack" },
  { id: "projects", label: "Projets" },
  { id: "blog",     label: "Blog" },
  { id: "contact",  label: "Contact" },
];

const IconGithub = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function Navbar() {
  const [active, setActive]   = useState("hero");
  const [menuOpen, setMenu]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location              = useLocation();
  const navigate              = useNavigate();

  const go = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setMenu(false);
  };

  useEffect(() => {
    if (location.pathname !== "/") return;
    const IDS = NAV.map(n => n.id);
    const fn = () => {
      const y = window.scrollY + 130;
      setScrolled(window.scrollY > 20);
      IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el && y >= el.offsetTop && y < el.offsetTop + el.offsetHeight) setActive(id);
      });
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, [location.pathname]);

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <>
      <motion.div
        initial={{ y: -100, x: "-50%" }}
        animate={{ y: 0, x: "-50%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? "top-4 w-[95%] md:w-[800px]" : "top-6 w-[95%] md:w-[900px]"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border rounded-full bg-white/5 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Logo */}
          <button onClick={() => go("hero")} className="flex items-center gap-2.5 transition-transform hover:scale-105">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-brand-400 to-brand-600 text-deep-space">
              <Terminal size={18} strokeWidth={2.5} />
            </div>
            <span className="text-[18px] font-display font-bold tracking-tight text-white">
              Jonathan<span className="text-brand-400">.</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden gap-1 md:flex bg-white/5 p-1 rounded-full border border-white/5">
            {NAV.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className="relative px-4 py-1.5 font-sans font-medium text-[14px] rounded-full transition-all duration-300 outline-none"
                style={{ color: active === id ? "#fff" : "rgba(255,255,255,0.6)" }}
              >
                {active === id && (
                  <motion.span 
                    layoutId="nav-active"
                    className="absolute inset-0 z-0 rounded-full bg-white/10" 
                    style={{ backdropFilter: "blur(8px)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/jonathan268"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 font-mono text-[13px] font-medium text-white/70 transition-all rounded-full hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20"
            >
              <IconGithub /> GitHub
            </a>
            <button
              className="flex items-center justify-center w-10 h-10 border rounded-full md:hidden bg-white/5 border-white/10 text-white/70 hover:bg-white/10 transition-colors"
              onClick={() => setMenu(o => !o)}
            >
              {menuOpen
                ? <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                : <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/></svg>
              }
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile menu focus */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-40 bg-deep-space/90 flex flex-col items-center justify-center"
            onClick={() => setMenu(false)}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {NAV.map(({ id, label }, i) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={(e) => { e.stopPropagation(); go(id); }}
                  className={`font-display text-4xl font-bold tracking-tight transition-all duration-300 ${active === id ? "gradient-text scale-110" : "text-white/40 hover:text-white"}`}
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NAV = [
  { id: "hero",     label: "Home" },
  { id: "about",    label: "À propos" },
  { id: "skills",   label: "Stack" },
  { id: "projects", label: "Projets" },
  { id: "blog",     label: "Blog" },
  { id: "contact",  label: "Contact" },
];

const IconGithub = () => (
  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function Navbar() {
  const [active, setActive]   = useState("hero");
  const [menuOpen, setMenu]   = useState(false);
  const location              = useLocation();

  // Only show on home page
  if (location.pathname !== "/") return null;

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };

  useEffect(() => {
    const IDS = NAV.map(n => n.id);
    const fn = () => {
      const y = window.scrollY + 130;
      IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el && y >= el.offsetTop && y < el.offsetTop + el.offsetHeight) setActive(id);
      });
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 px-6 navbar"
        style={{
          height: 66,
          backdropFilter: "blur(20px)",
          background: "rgba(26,16,63,0.9)",
          borderBottom: "1px solid rgba(231,121,193,0.12)",
        }}
      >
        {/* Logo */}
        <div className="navbar-start">
          <button onClick={() => go("hero")} className="flex items-center gap-2.5" style={{ background:"none", border:"none", cursor:"pointer" }}>
            <div className="btn btn-primary btn-sm btn-square" style={{ borderRadius: 10, fontSize: 16, minHeight: "unset", height: 36, width: 36 }}>J</div>
            <span className="font-ubuntu font-bold text-[17px] text-base-content/90">
              Jonathan<span className="text-primary">.</span>
            </span>
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="hidden gap-1 navbar-center md:flex">
          {NAV.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className="font-ubuntu font-medium text-[13.5px] px-3 py-1.5 rounded-lg transition-colors duration-200"
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: active === id ? "#e779c1" : "#9490b0",
                backgroundColor: active === id ? "rgba(231,121,193,0.1)" : "transparent",
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 navbar-end">
          <a
            href="https://github.com/jonathan268"
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-ghost font-mono gap-1.5 text-[13px]"
            style={{ border: "1px solid rgba(231,121,193,0.2)", color: "#9490b0" }}
          >
            <IconGithub /> GitHub
          </a>
          <button
            className="btn btn-sm btn-ghost btn-square md:hidden"
            style={{ border: "1px solid rgba(231,121,193,0.15)", color: "#9490b0" }}
            onClick={() => setMenu(o => !o)}
          >
            {menuOpen
              ? <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="fixed left-0 right-0 z-40 flex flex-col md:hidden"
        style={{
          top: 66,
          background: "#1a103f",
          borderBottom: "1px solid rgba(231,121,193,0.12)",
          transform: menuOpen ? "translateY(0)" : "translateY(-4px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
          transition: "transform .22s ease, opacity .22s ease",
        }}
      >
        {NAV.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => go(id)}
            className="font-ubuntu font-medium text-[15px] text-left px-5 py-3"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: active === id ? "#e779c1" : "#9490b0",
              borderBottom: "1px solid rgba(231,121,193,0.08)",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
